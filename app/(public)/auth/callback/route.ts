import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const supabase = await supabaseServer()

  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

  if (exchangeError) {
    console.error('Error exchanging code for session:', exchangeError)
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser()

    if (!getUserError && user) {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      if (!url || !serviceKey) {
        console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL for OAuth user creation.')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }

      const adminClient = createClient(url, serviceKey)

      const fullName =
        typeof user.user_metadata?.full_name === 'string'
          ? user.user_metadata.full_name
          : typeof user.user_metadata?.fullName === 'string'
          ? user.user_metadata.fullName
          : undefined

      // Use upsert so we always have a row and avoid no-row select edge cases
      const { error: upsertError } = await adminClient.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          full_name: fullName ?? user.email ?? 'Unknown',
        },
        { onConflict: 'id' }
      )

      if (upsertError) {
        console.error('Error upserting OAuth user into users table (admin client):', upsertError)
      }
    } else if (getUserError) {
      console.error('Error fetching user after OAuth session exchange:', getUserError)
    }
  } catch (e) {
    console.error('Unexpected error ensuring OAuth user exists in users table:', e)
  }

  return NextResponse.redirect(new URL('/dashboard', request.url))
}

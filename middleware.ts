import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value)
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')

  // Debug logs (commented out)
  // console.log('[proxy] path:', request.nextUrl.pathname, 'isDashboardPath:', isDashboardPath)
  // console.log('[proxy] user:', user ? { id: user.id, email: user.email } : null)
  // if (error) {
  //   console.error('[proxy] getUser error:', error)
  // }

  // Protect all /dashboard routes: if no authenticated user, redirect to login
  if ((!user || error) && isDashboardPath) {
    // console.log('[proxy] redirecting unauthenticated request to /login')
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  // console.log('[proxy] allowing request to continue')

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

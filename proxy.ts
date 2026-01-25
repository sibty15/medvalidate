import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middlewareSupabase'

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const isDashboardPath = request.nextUrl.pathname.startsWith('/dashboard')

  if (isDashboardPath && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('from', request.nextUrl.pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    // Run proxy + auth check on all app routes except static assets.
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
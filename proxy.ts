import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes accessible without authentication
const PUBLIC_PATHS  = new Set(['/', '/login', '/register', '/forgot-password'])
// Routes that authenticated users should not access
const AUTH_PATHS    = new Set(['/login', '/register', '/forgot-password'])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Always allow Next.js internals and API routes to pass through
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  const { response, user } = await updateSession(request)

  // /invite/[token] is public — unauthenticated users see the page and are asked to log in
  const isPublic  = PUBLIC_PATHS.has(pathname) || pathname.startsWith('/invite/')
  const isAuthPath = AUTH_PATHS.has(pathname)

  // Unauthenticated user trying to reach a protected route
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting login/register — send them to the app
  if (user && isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

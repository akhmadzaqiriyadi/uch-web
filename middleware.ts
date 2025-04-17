// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which paths require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/dashboard/articles',
  '/dashboard/events',
  '/dashboard/users',
  '/dashboard/settings'
]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const { pathname } = req.nextUrl

  // Check if the path is protected
  const isProtectedPath = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  )
  
  // Redirect unauthenticated users to login if they're accessing protected routes
  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and trying to access login/register pages, redirect to dashboard
  if (session && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

// Only run middleware on specific paths
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register'
  ],
}
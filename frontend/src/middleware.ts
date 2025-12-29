// middleware.ts (create this at the ROOT of your project, same level as app/)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get user data from cookie or create a way to check auth
  // Since localStorage isn't available in middleware, we'll check for token cookie
  const accessToken = request.cookies.get('accessToken')?.value
  
  // Try to get user data from a cookie (you'll need to set this on login)
  const userDataCookie = request.cookies.get('sf_user')?.value
  let user = null
  
  if (userDataCookie) {
    try {
      user = JSON.parse(userDataCookie)
    } catch (e) {
      console.error('Failed to parse user cookie')
    }
  }

  const isAuthenticated = !!accessToken || !!user
  const userRole = user?.role // 'influencer' or 'company'

  // Define route types
  const publicRoutes = ['/', '/login', '/signup']
  const influencerRoutes = ['/dashboard/influencer', '/profile/setup/influencer']
  const companyRoutes = ['/dashboard/company', '/profile/setup/company']
  
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route))
  const isInfluencerRoute = influencerRoutes.some(route => pathname.startsWith(route))
  const isCompanyRoute = companyRoutes.some(route => pathname.startsWith(route))
  const isAuthCallback = pathname === '/auth/callback'

  // ========================================
  // 1. Public routes - allow everyone
  // ========================================
  if (isPublicRoute) {
    // If already authenticated and trying to access login/signup, redirect to dashboard
    if (isAuthenticated && (pathname === '/login' || pathname === '/signup')) {
      const dashboardUrl = userRole === 'influencer' 
        ? '/dashboard/influencer' 
        : '/dashboard/company'
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
    return NextResponse.next()
  }

  // ========================================
  // 2. Auth callback - always allow
  // ========================================
  if (isAuthCallback) {
    return NextResponse.next()
  }

  // ========================================
  // 3. Protected routes - require authentication
  // ========================================
  if (!isAuthenticated) {
    // Not authenticated, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ========================================
  // 4. Role-based routing
  // ========================================
  
  // If influencer trying to access company routes
  if (userRole === 'influencer' && isCompanyRoute) {
    return NextResponse.redirect(new URL('/dashboard/influencer', request.url))
  }

  // If company trying to access influencer routes
  if (userRole === 'company' && isInfluencerRoute) {
    return NextResponse.redirect(new URL('/dashboard/company', request.url))
  }

  // All checks passed
  return NextResponse.next()
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
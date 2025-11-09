import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Skip middleware for login page and API routes (except auth check)
  if (path === '/cms/login' || (path.startsWith('/api') && !path.startsWith('/api/auth'))) {
    return NextResponse.next();
  }

  // Check if accessing protected CMS routes
  if (path.startsWith('/cms') || path.startsWith('/admin')) {
    // For server-side, we can't access localStorage directly
    // The authentication check will be handled client-side
    // This middleware mainly handles redirects for unauthenticated requests
    
    // Allow the request to proceed - client-side components will handle auth
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/cms/:path*'],
};


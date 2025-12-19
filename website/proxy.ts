import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/auth')) {
    // Use Better Auth to check session securely
    const session = await auth.api.getSession({ headers: req.headers });
    const isAuthPage = pathname === '/auth/sign-in' || pathname === '/auth/sign-up';
    if (session?.user) {
      // If user is logged in and tries to access sign-in or sign-up, redirect to home
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      // Otherwise, allow access to other /auth routes (e.g., sign-out, settings)
      return NextResponse.next();
    } else {
      // If not logged in and trying to access a protected /auth route (not sign-in or sign-up), redirect to sign-in
      if (!isAuthPage) {
        return NextResponse.redirect(new URL('/auth/sign-in', req.url));
      }
      // Allow access to sign-in and sign-up
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*'],
};

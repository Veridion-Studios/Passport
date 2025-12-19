import { NextRequest, NextResponse } from 'next/server';
import { auth } from './lib/auth';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/login')) {
    // Use Better Auth to check session securely
    const session = await auth.api.getSession({ headers: req.headers });
    if (session?.user) {
      // User is logged in, redirect to home
      return NextResponse.redirect(new URL('/', req.url));
    } else {
      // Not logged in, redirect to sign-in
      return NextResponse.redirect(new URL('/auth/sign-in', req.url));
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login/:path*'],
};

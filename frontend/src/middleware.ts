import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = ['/login', '/register'];
const PROTECTED_ROUTES = ['/dashboard'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for access token in cookies (for SSR-aware guard)
  // Since we use localStorage, we rely on client-side redirects in the pages themselves.
  // This middleware handles the root redirect only.
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
};

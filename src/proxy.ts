import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  // Paths that do not require authentication
  if (pathname.startsWith('/login') || pathname.startsWith('/update') || pathname.startsWith('/api') || pathname.startsWith('/_next') || pathname.startsWith('/manifest.json') || pathname === '/favicon.ico') {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (session !== 'true') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

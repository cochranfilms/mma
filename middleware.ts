import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl;
    const hostHeader = request.headers.get('host') || '';
    const host = hostHeader.split(',')[0].trim();

    const isApp = host.startsWith('app.');

    if (isApp) {
      const path = url.pathname;
      if (path === '/' || path === '/index.html') {
        url.pathname = '/_app-home';
        return NextResponse.rewrite(url);
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};



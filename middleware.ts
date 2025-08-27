import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') || '';

  const appHosts = [
    'app.marketingmousetrapagency.com',
    process.env.NEXT_PUBLIC_APP_HOST || '',
  ].filter(Boolean);

  const isApp = appHosts.some((h) => host.toLowerCase() === h.toLowerCase());

  if (isApp) {
    const path = url.pathname;
    if (path === '/' || path === '/index.html') {
      url.pathname = '/_app-home';
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};



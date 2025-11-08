import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Log API requests for debugging
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    console.log('API Request:', {
      method: request.method,
      url: request.url,
      pathname: request.nextUrl.pathname,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};

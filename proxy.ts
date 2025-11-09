import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  // Log API requests for debugging
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    console.log('API Request:', {
      method: request.method,
      url: request.url,
      pathname: request.nextUrl.pathname,
      headers: Object.fromEntries(request.headers.entries()),
    });

    // Create response and log it
    const response = NextResponse.next();

    // Log response after it's created
    response.headers.set('X-Debug-Rewrite', 'true');

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/v1/:path*',
};

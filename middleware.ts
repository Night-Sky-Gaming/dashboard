import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Block any Server Action requests to prevent the error
  const contentType = request.headers.get('content-type') || '';
  const nextAction = request.headers.get('next-action');
  
  // If this looks like a Server Action request, reject it
  if (nextAction || contentType.includes('action')) {
    console.log('Blocked potential Server Action request:', request.url);
    return new NextResponse('Server Actions are not enabled', { status: 400 });
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

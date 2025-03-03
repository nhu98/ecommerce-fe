import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/lib/utils';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('sessionToken')?.value;

  if (!sessionToken) {
    console.log('No sessionToken found, redirecting to login');
    return NextResponse.redirect(new URL('/', request.url));
  } else {
    const decodedToken = jwt.decode(sessionToken) as DecodedToken;

    if (decodedToken?.role_id !== 1) {
      console.log('Unauthorized access, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/admin/:path*'],
};

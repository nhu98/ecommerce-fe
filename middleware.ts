import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '@/lib/utils';

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken')?.value;

  if (!sessionToken) {
    console.log('No sessionToken found, redirecting to login');
    return NextResponse.redirect(new URL('/', request.url));
  } else {
    try {
      const decodedToken = jwt.decode(sessionToken) as DecodedToken;

      if (decodedToken?.role_id !== 1) {
        console.log('Unauthorized access, redirecting to home');
        return NextResponse.redirect(new URL('/', request.url));
      }
      return NextResponse.next();
    } catch (error) {
      console.log('Token decode error:', error);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
}

export const config = {
  matcher: ['/admin/:path*'],
  runtime: 'nodejs',
};

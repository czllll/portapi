import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const TOKEN_KEY = 'access_token';
  const token = request.cookies.get(TOKEN_KEY)
  const { pathname } = request.nextUrl

  const publicPaths = ['/auth/login', '/auth/register']
  
  if (!token && !publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
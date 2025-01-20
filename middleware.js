import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = [
  '/',
  '/dashboard',
  '/dashboard/trading',
  '/dashboard/new-strategy',
  '/dashboard/strategy-display',
]

export async function middleware(request) {
  const pathname = request.nextUrl.pathname

  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', encodeURIComponent(pathname))
      return NextResponse.redirect(url)
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')
      const { payload } = await jwtVerify(token, secret)
      
      if (!payload || !payload.userId) {
        throw new Error('Invalid token payload')
      }

      return NextResponse.next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      const url = new URL('/login', request.url)
      url.searchParams.set('from', encodeURIComponent(pathname))
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|login|public).*)',
  ],
}
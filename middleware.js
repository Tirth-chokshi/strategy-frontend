import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const protectedRoutes = [
  '/dashboard',
  '/dashboard/new-strategy',
  '/dashboard/strategy-display',
]

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }

    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET)
      )
      
      return NextResponse.next()
    } catch (error) {
      const url = new URL('/login', request.url)
      url.searchParams.set('from', pathname)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
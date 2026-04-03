import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthSecret } from '@/lib/auth-secret'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  const token = await getToken({
    req,
    secret: getAuthSecret(),
  })

  if (!token) {
    const login = new URL('/admin/login', req.url)
    login.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(login)
  }

  if (String(token.role) !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

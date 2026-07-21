import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, TOKEN_AUDIENCE, TOKEN_ISSUER } from '@/lib/auth-constants'

function loginRedirect(request: NextRequest) {
  const url = new URL('/login', request.url)
  url.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const secret = process.env.JWT_SECRET

  if (!token || !secret || secret.length < 32) return loginRedirect(request)

  try {
    await jwtVerify(token, new TextEncoder().encode(secret), {
      algorithms: ['HS256'],
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE,
    })
    return NextResponse.next()
  } catch {
    return loginRedirect(request)
  }
}

export const config = {
  matcher: [
    '/onboarding/:path*',
    '/dashboard/:path*',
    '/nexitnation/:path*',
    '/visa-wizard/:path*',
    '/countries/:path*',
    '/checklist/:path*',
    '/cost-calculator/:path*',
    '/documents/:path*',
    '/settings/:path*',
  ],
}

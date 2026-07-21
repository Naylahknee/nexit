import 'server-only'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import { SESSION_COOKIE, TOKEN_AUDIENCE, TOKEN_ISSUER } from './auth-constants'

export { SESSION_COOKIE } from './auth-constants'

export type SessionUser = { id: number; email: string }

function getSecret() {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) throw new Error('JWT_SECRET must be at least 32 characters')
  return new TextEncoder().encode(secret)
}

export async function createToken(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(TOKEN_ISSUER)
    .setAudience(TOKEN_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, getSecret(), {
    algorithms: ['HS256'],
    issuer: TOKEN_ISSUER,
    audience: TOKEN_AUDIENCE,
  })
  return payload
}

function toSessionUser(payload: JWTPayload): SessionUser | null {
  const id = Number(payload.sub)
  const email = typeof payload.email === 'string' ? payload.email : ''
  return Number.isInteger(id) && id > 0 && email ? { id, email } : null
}

export async function getCurrentUser() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value
  if (!token) return null
  try { return toSessionUser(await verifyToken(token)) } catch { return null }
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  return user
}

export async function getRequestUser(request: Request) {
  const authorization = request.headers.get('authorization')
  const bearer = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined
  const cookieToken = request.headers.get('cookie')?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${SESSION_COOKIE}=`))?.slice(SESSION_COOKIE.length + 1)
  const token = bearer ?? cookieToken
  if (!token) return null
  try { return toSessionUser(await verifyToken(token)) } catch { return null }
}

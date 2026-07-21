import { compare, hash } from 'bcryptjs'
import { NextResponse } from 'next/server'
import { createToken, SESSION_COOKIE } from '@/lib/auth'
import { getSql } from '@/lib/db'
import { authSchema } from '@/lib/schemas'

type UserRow = { id: number; email: string; password: string }

export async function POST(request: Request) {
  try {
    const parsed = authSchema.safeParse(await request.json())
    if (!parsed.success) return Response.json({ error: 'Use a valid email and a password of at least 8 characters.' }, { status: 400 })
    const { email, password, mode } = parsed.data

    const sql = getSql()
    const users = await sql`SELECT id, email, password FROM users WHERE email = ${email} LIMIT 1` as UserRow[]
    let user = users[0]

    if (mode === 'signup' && user) {
      return Response.json({ error: 'An account with that email already exists.' }, { status: 409 })
    }

    if (mode === 'signup') {
      const passwordHash = await hash(password, 12)
      const inserted = await sql`
        INSERT INTO users (email, password)
        VALUES (${email}, ${passwordHash})
        RETURNING id, email, password
      ` as UserRow[]
      user = inserted[0]
    } else if (!user || !(await compare(password, user.password))) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = await createToken({ sub: String(user.id), email: user.email })
    const response = NextResponse.json({ token })
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    console.error('Login failed', error)
    return Response.json({ error: 'Unable to sign in right now.' }, { status: 500 })
  }
}

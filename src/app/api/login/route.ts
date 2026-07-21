import { compare, hash } from 'bcryptjs'
import { createToken } from '@/lib/auth'
import { getSql } from '@/lib/db'

type UserRow = { id: number; email: string; password: string }

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
      return Response.json({ error: 'Use a valid email and a password of at least 8 characters.' }, { status: 400 })
    }

    const sql = getSql()
    const users = await sql`SELECT id, email, password FROM users WHERE email = ${email} LIMIT 1` as UserRow[]
    let user = users[0]

    if (!user) {
      const passwordHash = await hash(password, 12)
      const inserted = await sql`
        INSERT INTO users (email, password)
        VALUES (${email}, ${passwordHash})
        RETURNING id, email, password
      ` as UserRow[]
      user = inserted[0]
    } else if (!(await compare(password, user.password))) {
      return Response.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = await createToken({ sub: String(user.id), email: user.email })
    return Response.json({ token })
  } catch (error) {
    console.error('Login failed', error)
    return Response.json({ error: 'Unable to sign in right now.' }, { status: 500 })
  }
}

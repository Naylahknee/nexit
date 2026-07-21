import { verifyToken } from '@/lib/auth'
import { getSql } from '@/lib/db'

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization')
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined

  if (!token) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await verifyToken(token)
    const countries = await getSql()`
      SELECT id, name, visa_type, income_required
      FROM countries
      ORDER BY income_required ASC
    `
    return Response.json(countries)
  } catch {
    return Response.json({ error: 'Invalid or expired session.' }, { status: 401 })
  }
}

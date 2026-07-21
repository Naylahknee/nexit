import { getRequestUser } from '@/lib/auth'
import { COUNTRY_CODE_BY_NAME } from '@/lib/countries'
import { getSql } from '@/lib/db'

type CountryRow = {
  id: number
  name: string
  visa_type: string
  income_required: number
}

export async function GET(request: Request) {
  if (!(await getRequestUser(request))) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const countries = await getSql()`
      SELECT id, name, visa_type, income_required
      FROM countries
      ORDER BY income_required ASC
    ` as CountryRow[]

    return Response.json(countries.map((country) => ({
      ...country,
      country_code: COUNTRY_CODE_BY_NAME[country.name] ?? null,
    })))
  } catch {
    return Response.json({ error: 'Unable to load countries.' }, { status: 500 })
  }
}

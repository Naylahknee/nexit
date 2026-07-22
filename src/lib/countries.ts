export type CountryDetail = {
  slug: string
  name: string
  code: string
  city: string
  region: 'Europe' | 'Americas'
  visaType: string
  incomeRequired: number
  safety: 'High' | 'Good'
  cost: '$' | '$$'
  match: number
  summary: string
}

export const COUNTRIES: CountryDetail[] = [
  {
    slug: 'portugal', name: 'Portugal', code: 'PT', city: 'Lisbon', region: 'Europe',
    visaType: 'D7', incomeRequired: 2000, safety: 'High', cost: '$$', match: 92,
    summary: 'A sunny Atlantic base with walkable cities, strong infrastructure, and a welcoming international community.',
  },
  {
    slug: 'spain', name: 'Spain', code: 'ES', city: 'Barcelona', region: 'Europe',
    visaType: 'Digital Nomad', incomeRequired: 2500, safety: 'High', cost: '$$', match: 90,
    summary: 'A lively Mediterranean option with excellent transport, deep culture, and a dedicated remote-work visa.',
  },
  {
    slug: 'greece', name: 'Greece', code: 'GR', city: 'Athens', region: 'Europe',
    visaType: 'Digital Nomad', incomeRequired: 3500, safety: 'Good', cost: '$$', match: 85,
    summary: 'A Mediterranean base with historic cities, island options, and a residence route for qualifying remote professionals.',
  },
  {
    slug: 'estonia', name: 'Estonia', code: 'EE', city: 'Tallinn', region: 'Europe',
    visaType: 'Digital Nomad', incomeRequired: 4500, safety: 'High', cost: '$$', match: 83,
    summary: 'A digitally connected Northern European option with efficient public services and a dedicated remote-work pathway.',
  },
  {
    slug: 'mexico', name: 'Mexico', code: 'MX', city: 'Playa del Carmen', region: 'Americas',
    visaType: 'Temporary Resident', incomeRequired: 1500, safety: 'Good', cost: '$', match: 86,
    summary: 'A flexible nearby move with diverse cities, tropical coastlines, and a lower day-to-day cost in many regions.',
  },
]

export const COUNTRY_CODE_BY_NAME: Record<string, string> = Object.fromEntries(COUNTRIES.map((country) => [country.name, country.code]))

export function countryFlag(code: string) {
  return code.toUpperCase().replace(/./g, (character) => String.fromCodePoint(127397 + character.charCodeAt(0)))
}

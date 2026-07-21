import type { RegionSlug } from './regionData'

export type GreenbookEntry = {
  id: string
  regionSlug: RegionSlug
  location: string
  author: string
  context: string
  note: string
  tags: string[]
}

export const GREENBOOK_ENTRIES: GreenbookEntry[] = [
  {
    id: 'lisbon-first-month',
    regionSlug: 'europe',
    location: 'Lisbon, Portugal',
    author: 'Ari · moved in 2025',
    context: 'First-month reality check',
    note: 'Choose your neighborhood around the errands you repeat, not just the view. A grocery store and transit stop within ten minutes changed my daily experience.',
    tags: ['Neighborhoods', 'Daily life'],
  },
  {
    id: 'valencia-paperwork',
    regionSlug: 'europe',
    location: 'Valencia, Spain',
    author: 'Morgan · remote designer',
    context: 'Paperwork tip',
    note: 'Keep a printed and cloud copy of every appointment confirmation. The process felt much easier once my documents were organized in the order officials requested them.',
    tags: ['Documents', 'Arrival'],
  },
  {
    id: 'merida-seasons',
    regionSlug: 'americas',
    location: 'Mérida, Mexico',
    author: 'Danielle · family of three',
    context: 'Climate planning',
    note: 'Visit during the hottest part of the year before committing. We loved the city, but experiencing the full season helped us choose the right neighborhood and home setup.',
    tags: ['Climate', 'Housing'],
  },
  {
    id: 'medellin-budget',
    regionSlug: 'americas',
    location: 'Medellín, Colombia',
    author: 'Chris · independent consultant',
    context: 'Budget note',
    note: 'Short-term furnished rent can distort your budget. I planned with a higher first-month number, then compared longer leases only after learning the neighborhoods in person.',
    tags: ['Budget', 'Housing'],
  },
  {
    id: 'kl-connectivity',
    regionSlug: 'asia-pacific',
    location: 'Kuala Lumpur, Malaysia',
    author: 'Samira · product manager',
    context: 'Workday setup',
    note: 'Test your calls from the apartment before signing. Building-level internet quality varied more than the neighborhood, even when every listing advertised high speeds.',
    tags: ['Remote work', 'Housing'],
  },
  {
    id: 'chiang-mai-air',
    regionSlug: 'asia-pacific',
    location: 'Chiang Mai, Thailand',
    author: 'Leo · moved in 2024',
    context: 'Seasonal context',
    note: 'Air quality season is a real planning factor. Build it into your calendar and budget rather than treating it as a surprise after you arrive.',
    tags: ['Climate', 'Health'],
  },
  {
    id: 'accra-community',
    regionSlug: 'africa-middle-east',
    location: 'Accra, Ghana',
    author: 'Nia · founder',
    context: 'Community note',
    note: 'Warm introductions matter. Joining two local professional groups before moving gave me practical housing leads and a much softer landing.',
    tags: ['Community', 'Work'],
  },
  {
    id: 'mauritius-car',
    regionSlug: 'africa-middle-east',
    location: 'Grand Baie, Mauritius',
    author: 'Taylor · remote analyst',
    context: 'Daily transport',
    note: 'The island looks compact on a map, but your transport plan shapes everything. Test the commute to groceries, healthcare, and coworking before choosing a lease.',
    tags: ['Transport', 'Daily life'],
  },
]

export function getGreenbookEntries(regionSlug?: RegionSlug) {
  const entries = regionSlug
    ? GREENBOOK_ENTRIES.filter((entry) => entry.regionSlug === regionSlug)
    : GREENBOOK_ENTRIES

  return entries.slice(0, 4)
}

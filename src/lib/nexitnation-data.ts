export type CountryPreview = {
  name: string
  slug: string
  city: string
  monthlyCost: number
  pathway: string
  communityFit: string
  image: string
}

export type RegionConfig = {
  slug: RegionSlug
  name: string
  countryCount: number
  center: [number, number]
  zoom: number
  image: string
  description: string
  indicators: string[]
  countries: CountryPreview[]
}

export const REGION_SLUGS = [
  'europe',
  'africa',
  'asia',
  'north-america',
  'latin-america',
  'oceania',
] as const

export type RegionSlug = (typeof REGION_SLUGS)[number]

export const regions: Record<RegionSlug, RegionConfig> = {
  europe: {
    slug: 'europe',
    name: 'Europe',
    countryCount: 32,
    center: [15, 51],
    zoom: 3.2,
    image: '/images/regions/europe.webp',
    description:
      'Diverse cultures, established infrastructure, multiple residency pathways, and a wide range of lifestyle options.',
    indicators: ['Strong healthcare', 'Good infrastructure', 'Multiple pathways'],
    countries: [
      {
        name: 'Portugal',
        slug: 'portugal',
        city: 'Lisbon',
        monthlyCost: 2100,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Strong',
        image: '/images/countries/portugal.webp',
      },
      {
        name: 'Spain',
        slug: 'spain',
        city: 'Barcelona',
        monthlyCost: 2300,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Strong',
        image: '/images/countries/spain.webp',
      },
      {
        name: 'Greece',
        slug: 'greece',
        city: 'Athens',
        monthlyCost: 2000,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Moderate',
        image: '/images/countries/greece.webp',
      },
      {
        name: 'Estonia',
        slug: 'estonia',
        city: 'Tallinn',
        monthlyCost: 1800,
        pathway: 'Digital Nomad Pathway',
        communityFit: 'Moderate',
        image: '/images/countries/estonia.webp',
      },
    ],
  },
  africa: {
    slug: 'africa',
    name: 'Africa',
    countryCount: 54,
    center: [20, 3],
    zoom: 2.6,
    image: '/images/regions/africa.webp',
    description:
      'A broad range of cultures, growing economic centers, diaspora communities, and emerging residency opportunities.',
    indicators: ['Diaspora communities', 'Growing markets', 'Varied cost of living'],
    countries: [],
  },
  asia: {
    slug: 'asia',
    name: 'Asia',
    countryCount: 49,
    center: [95, 34],
    zoom: 2.4,
    image: '/images/regions/asia.webp',
    description:
      'Major global cities, varied costs of living, expanding remote-work programs, and diverse cultural environments.',
    indicators: ['Affordable options', 'Major cities', 'Remote-work programs'],
    countries: [],
  },
  'north-america': {
    slug: 'north-america',
    name: 'North America',
    countryCount: 14,
    center: [-105, 43],
    zoom: 2.5,
    image: '/images/regions/north-america.webp',
    description:
      'Closer relocation options with varied residency, work, retirement, and family pathways.',
    indicators: ['Closer to the U.S.', 'Major expat hubs', 'Varied pathways'],
    countries: [],
  },
  'latin-america': {
    slug: 'latin-america',
    name: 'Latin America',
    countryCount: 21,
    center: [-64, -17],
    zoom: 2.5,
    image: '/images/regions/latin-america.webp',
    description:
      'Accessible residency options, lower living costs, established expat communities, and proximity to the United States.',
    indicators: ['Lower living costs', 'Residency options', 'Regional access'],
    countries: [],
  },
  oceania: {
    slug: 'oceania',
    name: 'Oceania',
    countryCount: 8,
    center: [145, -25],
    zoom: 3,
    image: '/images/regions/oceania.webp',
    description:
      'Strong infrastructure, outdoor lifestyles, education options, and skilled-worker pathways.',
    indicators: ['Strong infrastructure', 'Family options', 'Skilled pathways'],
    countries: [],
  },
}

export const regionList = REGION_SLUGS.map((slug) => regions[slug])

export function isNexitnationRegion(value: string): value is RegionSlug {
  return REGION_SLUGS.some((slug) => slug === value)
}

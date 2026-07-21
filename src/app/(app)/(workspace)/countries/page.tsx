import { CountriesBrowser } from '@/components/nexit/countries-browser'

export default async function CountriesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q = '' } = await searchParams
  return <CountriesBrowser initialQuery={Array.isArray(q) ? q[0] ?? '' : q} />
}

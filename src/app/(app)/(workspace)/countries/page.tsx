import { CountriesBrowser } from '@/components/nexit/countries-browser'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function CountriesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q = '' } = await searchParams
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  return <CountriesBrowser initialQuery={Array.isArray(q) ? q[0] ?? '' : q} profileComplete={profile.wizard_status === 'completed'} />
}

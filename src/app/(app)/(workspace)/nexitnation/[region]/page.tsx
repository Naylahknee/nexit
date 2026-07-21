import { notFound } from 'next/navigation'
import { NextinationPage } from '@/components/nexit/NextinationPage'
import { requireCurrentUser } from '@/lib/auth'
import { isRegionSlug, REGIONS } from '@/lib/regionData'
import { loadNexitnationProfile } from '@/lib/userProfile'

export function generateStaticParams() {
  return REGIONS.map((region) => ({ region: region.slug }))
}

export default async function NexitnationRegionPage({ params }: { params: Promise<{ region: string }> }) {
  const { region } = await params
  if (!isRegionSlug(region)) notFound()

  const user = await requireCurrentUser()
  return <NextinationPage profile={await loadNexitnationProfile(user.id, user.email)} initialRegion={region} />
}

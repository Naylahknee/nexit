import { NextinationPage } from '@/components/nexit/NextinationPage'
import { requireCurrentUser } from '@/lib/auth'
import { loadNexitnationProfile } from '@/lib/userProfile'

export default async function NexitnationPage() {
  const user = await requireCurrentUser()
  return <NextinationPage profile={await loadNexitnationProfile(user.id, user.email)} />
}

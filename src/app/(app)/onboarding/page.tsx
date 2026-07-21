import { requireCurrentUser } from '@/lib/auth'
import { OnboardingFlow } from '@/components/nexit/onboarding-flow'
import { getProfile } from '@/lib/profile'

export default async function OnboardingPage() {
  const user = await requireCurrentUser()
  return <OnboardingFlow initial={await getProfile(user.id)} />
}

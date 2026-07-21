import { CostCalculator } from '@/components/nexit/cost-calculator'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function CostCalculatorPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  return <CostCalculator income={profile.monthly_income} />
}

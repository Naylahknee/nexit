import { VisaWizard } from '@/components/nexit/visa-wizard'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function VisaWizardPage() {
  const user = await requireCurrentUser()
  return <VisaWizard initial={await getProfile(user.id)} />
}

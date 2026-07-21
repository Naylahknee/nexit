import { MoveChecklist } from '@/components/nexit/checklist'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function ChecklistPage() {
  const user = await requireCurrentUser()
  return <MoveChecklist initial={await getProfile(user.id)} />
}

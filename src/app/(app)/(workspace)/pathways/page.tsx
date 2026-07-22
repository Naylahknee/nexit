import type { Metadata } from 'next'
import { PathwaysResults } from '@/components/nexit/pathways-results'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export const metadata: Metadata = { title: 'Nexit Pathways | Nexit', description: 'Compare official residency and visa Pathways using your Nexit Profile.' }

export default async function PathwaysPage() {
  const user = await requireCurrentUser()
  return <PathwaysResults profile={await getProfile(user.id)} />
}

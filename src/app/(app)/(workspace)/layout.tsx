import { redirect } from 'next/navigation'
import { requireCurrentUser } from '@/lib/auth'
import { AppShell } from '@/components/nexit/app-shell'
import { getProfile } from '@/lib/profile'

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  if (profile.wizard_status === 'not_started') redirect('/welcome')
  if (profile.wizard_status === 'in_progress') redirect('/profile-wizard')
  return <AppShell email={user.email} wizardStatus={profile.wizard_status}>{children}</AppShell>
}

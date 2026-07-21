import { requireCurrentUser } from '@/lib/auth'
import { AppShell } from '@/components/nexit/app-shell'

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await requireCurrentUser()
  return <AppShell email={user.email}>{children}</AppShell>
}

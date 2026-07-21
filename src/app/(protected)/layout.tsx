import { requireCurrentUser } from '@/lib/auth'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireCurrentUser()
  return children
}

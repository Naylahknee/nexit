import { SettingsForm } from '@/components/nexit/settings-form'
import { requireCurrentUser } from '@/lib/auth'
import { getProfile } from '@/lib/profile'

export default async function SettingsPage() { const user = await requireCurrentUser(); return <SettingsForm email={user.email} initial={await getProfile(user.id)} /> }

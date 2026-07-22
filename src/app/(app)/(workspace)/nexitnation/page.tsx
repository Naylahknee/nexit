import type { Metadata } from 'next'
import NexitnationMap from '@/components/nexit/NexitnationMap'
import { requireCurrentUser } from '@/lib/auth'
import { NEXIT_LEXICON } from '@/lib/lexicon'
import { loadNexitnationProfile } from '@/lib/userProfile'

export const metadata: Metadata = {
  title: 'Nexitnation Map | Nexit',
  description: 'Compare regions, review relocation Pathways, and choose a Nextination that fits your Nexit Profile.',
}

export default async function NexitnationPage() {
  const user = await requireCurrentUser()
  const profile = await loadNexitnationProfile(user.id, user.email)
  const household = profile.familySize === 1 ? 'Solo planner' : `${profile.familySize}-person household`

  return (
    <div>
      <header className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-deep">Global discovery</p>
        <h1 id="nexitnation-map-title" className="mt-2 font-display text-4xl font-bold text-navy sm:text-5xl">
          {NEXIT_LEXICON.mapTitle}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Compare regions through your budget, work setup, priorities, and Community Fit. Select a region to open its Nextination page.
        </p>
      </header>

      <NexitnationMap
        profile={{
          budget: profile.monthlyIncome,
          remoteWorker: profile.remote,
          household,
        }}
      />
    </div>
  )
}

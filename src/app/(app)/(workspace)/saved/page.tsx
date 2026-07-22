import { SavedNextinations } from '@/components/nexit/saved-nextinations'

export default function SavedPage() {
  return (
    <div>
      <p className="text-sm font-bold text-gold-deep">Your shortlist</p>
      <h1 className="mt-1 font-display text-4xl font-bold">Saved Nextinations</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Keep the places you want to compare close while you review Pathways, costs, and Community Fit.</p>
      <SavedNextinations />
    </div>
  )
}

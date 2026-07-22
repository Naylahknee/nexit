import Link from 'next/link'
import { ArrowRight, BookOpen, MapPin } from 'lucide-react'
import { GREENBOOK_ENTRIES } from '@/lib/greenbook'

export default function GreenbookPage() {
  return (
    <div>
      <p className="text-sm font-bold text-teal-deep">Community context</p>
      <h1 className="mt-1 font-display text-4xl font-bold">Greenbook Insights</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">Practical prompts for researching daily life, neighborhoods, documents, and Community Fit before committing to a Nextination.</p>
      <div className="mt-7 grid gap-5 lg:grid-cols-2">
        {GREENBOOK_ENTRIES.map((entry) => (
          <article key={entry.id} className="card-surface p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-teal-soft text-teal-deep"><MapPin size={18} /></span>
              <div><p className="font-extrabold">{entry.location}</p><p className="text-xs font-semibold text-teal-deep">{entry.context}</p></div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">{entry.note}</p>
            <div className="mt-4 flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="rounded-pill bg-teal-soft px-3 py-1 text-xs font-bold text-teal-deep">{tag}</span>)}</div>
            <p className="mt-4 border-t border-line pt-4 text-xs text-muted">{entry.sourceLabel}. Planning guidance—not a verified member testimonial.</p>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded-card bg-navy p-7 text-white sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div><BookOpen className="text-gold" /><h2 className="mt-3 text-2xl font-extrabold">Apply context to a specific Nextination</h2><p className="mt-2 text-sm text-white/70">Review country details alongside official sources before making a decision.</p></div>
        <Link href="/countries" className="gold-button mt-5 shrink-0 sm:mt-0">Compare Nextinations <ArrowRight size={16} /></Link>
      </section>
    </div>
  )
}

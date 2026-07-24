'use client'

import Link from 'next/link'
import { useRef, useState, type KeyboardEvent } from 'react'
import { ArrowRight, BookOpenText, Compass, ExternalLink, Heart, Layers, ListChecks, Scale, Sparkles } from 'lucide-react'
import { countryFlag } from '@/lib/countries'
import { ScoreRing } from '@/components/nexit/rings'
import { IMPLEMENTED_TABS, type CountryTabId, type TabMeta } from '@/lib/country-workspace/tabs'

type CountrySummary = {
  slug: string; name: string; code: string; city: string; region: string
  visaType: string; incomeRequired: number; safety: string; cost: string; summary: string
}
type MatchData = { score: number; reasons: string[]; tradeoff: string }
type PathwayCardData = {
  id: string; name: string; country: string; category: string; status: string
  requirementsMet: string[]; missingRequirements: string[]; incomeThreshold: string
  officialSource: string; sourceLabel: string; lastVerified: string
}

type Props = {
  country: CountrySummary
  match: MatchData | null
  readiness: number | null
  tabs: TabMeta[]
  allTabs: TabMeta[]
  pathways: PathwayCardData[]
  fromQuiz: boolean
}

function matchLabel(score: number) {
  if (score >= 85) return 'Excellent Match'
  if (score >= 70) return 'Strong Match'
  if (score >= 55) return 'Good Match'
  return 'Emerging Match'
}

const statusTone: Record<string, string> = {
  'Strong Match': 'bg-ok-soft text-ok',
  'Possible Match': 'bg-warn-soft text-warn',
  'Missing Requirements': 'bg-info-soft text-info',
}

export function CountryWorkspace({ country, match, readiness, tabs, allTabs, pathways, fromQuiz }: Props) {
  const [personalized, setPersonalized] = useState(true)
  const shown = personalized ? tabs : allTabs
  const [active, setActive] = useState<CountryTabId>(shown[0]?.id ?? 'overview')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
    event.preventDefault()
    const delta = event.key === 'ArrowRight' ? 1 : -1
    const next = (index + delta + shown.length) % shown.length
    setActive(shown[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      {fromQuiz ? <p className="mb-4 inline-flex items-center gap-2 rounded-pill bg-gold-soft px-3 py-1.5 text-xs font-bold text-gold-deep"><Sparkles size={14} /> Your top Nextination from the Nexit Match Quiz</p> : null}

      {/* Hero */}
      <section className="overflow-hidden rounded-card bg-navy-deep p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-4xl" aria-hidden>{countryFlag(country.code)}</span>
              <div>
                <h1 className="font-display text-4xl font-bold leading-none">{country.name}</h1>
                <p className="mt-1 text-sm text-white/60">{country.city} · {country.region}</p>
              </div>
            </div>
            {match ? (
              <>
                <p className="mt-5 text-sm font-bold uppercase tracking-[.16em] text-gold">{matchLabel(match.score)}</p>
                {match.reasons.length ? (
                  <ul className="mt-3 space-y-1.5">
                    {match.reasons.map((reason) => (
                      <li key={reason} className="flex gap-2 text-sm text-white/85"><span className="text-gold">•</span>{reason}</li>
                    ))}
                  </ul>
                ) : null}
                <p className="mt-3 text-sm text-white/60"><span className="font-bold text-white/80">Tradeoff:</span> {match.tradeoff}</p>
              </>
            ) : (
              <p className="mt-5 text-sm text-white/70">Complete your Nexit Profile to see your personalized Nexit Match for {country.name}.</p>
            )}
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/saved" className="inline-flex items-center gap-2 rounded-field bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15"><Heart size={16} /> Save as a Nextination</Link>
              <Link href="/countries" className="inline-flex items-center gap-2 rounded-field bg-white/10 px-4 py-2.5 text-sm font-bold hover:bg-white/15"><Layers size={16} /> Compare</Link>
              <Link href="/nexit-plan" className="gold-button">Build Your Nexit Plan <ArrowRight size={16} /></Link>
            </div>
          </div>
          {match ? (
            <div className="shrink-0 rounded-card bg-white/5 p-4 text-center">
              <ScoreRing value={match.score} label="Nexit Match" size={132} />
              {readiness !== null ? <p className="mt-2 text-xs text-white/60">Nexit Readiness <span className="font-bold text-white">{readiness}%</span></p> : null}
            </div>
          ) : null}
        </div>
      </section>

      {/* Adaptive tab bar */}
      <div className="mt-5 flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Country sections" className="flex gap-1.5 overflow-x-auto pb-1" onKeyDown={(e) => { const i = shown.findIndex((t) => t.id === active); if (i >= 0) onKeyDown(e, i) }}>
          {shown.map((tab, index) => {
            const selected = tab.id === active
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[index] = el }}
                role="tab"
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className={`shrink-0 rounded-pill px-3.5 py-2 text-sm font-bold transition ${selected ? 'bg-gold text-navy' : 'bg-white text-muted hover:text-navy'} border border-line`}
              >
                {tab.shortLabel}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={() => setPersonalized((v) => !v)} className="shrink-0 text-xs font-bold text-gold-deep">
          {personalized ? 'All sections' : 'Personalized for you'}
        </button>
      </div>

      {/* Active panel */}
      <div role="tabpanel" className="mt-5">
        <TabPanel id={active} country={country} match={match} pathways={pathways} />
      </div>
    </div>
  )
}

function TabPanel({ id, country, match, pathways }: { id: CountryTabId; country: CountrySummary; match: MatchData | null; pathways: PathwayCardData[] }) {
  if (!IMPLEMENTED_TABS.includes(id)) {
    return (
      <section className="card-surface p-8 text-center">
        <Compass className="mx-auto text-gold-deep" />
        <p className="mt-3 font-extrabold text-navy">Research in progress</p>
        <p className="mt-1 text-sm text-muted">We are still verifying this section for {country.name}. Check the Resources tab for official links in the meantime.</p>
      </section>
    )
  }

  if (id === 'overview') {
    return (
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <section className="card-surface p-6">
          <h2 className="font-display text-2xl font-bold text-navy">Overview</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{country.summary}</p>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Fact label="Region" value={country.region} />
            <Fact label="Common base city" value={country.city} />
            <Fact label="Typical income guide" value={`$${country.incomeRequired.toLocaleString()}/mo`} />
            <Fact label="Relative cost" value={country.cost} />
            <Fact label="Safety signal" value={country.safety} />
            <Fact label="Common route" value={country.visaType} />
          </dl>
        </section>
        <section className="card-surface p-6">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Recommended first actions</p>
          <div className="mt-4 space-y-2">
            <Link href="/pathways" className="flex items-center justify-between rounded-xl bg-canvas p-4 text-sm font-bold text-navy hover:bg-gold-soft/50"><span className="flex items-center gap-2"><ListChecks size={16} /> Review your Nexit Pathways</span><ArrowRight size={15} /></Link>
            <Link href="/cost-calculator" className="flex items-center justify-between rounded-xl bg-canvas p-4 text-sm font-bold text-navy hover:bg-gold-soft/50"><span className="flex items-center gap-2"><Scale size={16} /> Build your Cost Snapshot</span><ArrowRight size={15} /></Link>
            <Link href="/nexit-plan" className="flex items-center justify-between rounded-xl bg-canvas p-4 text-sm font-bold text-navy hover:bg-gold-soft/50"><span className="flex items-center gap-2"><BookOpenText size={16} /> Start your Nexit Plan</span><ArrowRight size={15} /></Link>
          </div>
        </section>
      </div>
    )
  }

  if (id === 'why-you') {
    return (
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Why {country.name} matches you</h2>
        {match ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2">
              {match.reasons.map((reason) => <span key={reason} className="rounded-pill bg-gold-soft/60 px-3 py-1.5 text-xs font-bold text-navy">{reason}</span>)}
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">We surfaced {country.name} because of how your Nexit Profile lines up with what this place asks for — the factors above weigh budget compatibility, your preferred regions, and available Pathways. <span className="font-semibold text-navy">Tradeoff:</span> {match.tradeoff}</p>
            <p className="mt-4 text-xs text-muted">This explanation is generated from your quiz answers. It is planning guidance, not a guarantee.</p>
          </>
        ) : <p className="mt-3 text-sm text-muted">Complete your Nexit Profile to see why {country.name} matches you.</p>}
      </section>
    )
  }

  if (id === 'cost-of-living') {
    return (
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Cost of Living</h2>
        <p className="mt-2 text-sm text-muted">A common planning income guide for {country.name} is around <b className="text-navy">${country.incomeRequired.toLocaleString()}/mo</b>, but real costs vary widely by city and lifestyle.</p>
        <Link href="/cost-calculator" className="gold-button mt-5">Open the Cost Calculator <ArrowRight size={16} /></Link>
        <p className="mt-4 text-xs text-muted">Category-level estimates and a compare-to-your-city view are being verified for {country.name}.</p>
      </section>
    )
  }

  if (id === 'pathways') {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {pathways.map((p) => (
          <article key={p.id} className="card-surface p-5">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="font-extrabold text-navy">{p.name}</h3><p className="text-xs text-muted">{p.country} · {p.category}</p></div>
              <span className={`shrink-0 rounded-pill px-2.5 py-1 text-[11px] font-bold ${statusTone[p.status] ?? 'bg-canvas text-muted'}`}>{p.status}</span>
            </div>
            <p className="mt-3 text-xs text-muted">Income guide: {p.incomeThreshold}</p>
            {p.requirementsMet.length ? <p className="mt-2 text-xs text-ok">✓ {p.requirementsMet.slice(0, 2).join(' · ')}</p> : null}
            {p.missingRequirements.length ? <p className="mt-1 text-xs text-muted">Needs: {p.missingRequirements.slice(0, 2).join(' · ')}</p> : null}
            <a href={p.officialSource} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-gold-deep">{p.sourceLabel} <ExternalLink size={12} /></a>
          </article>
        ))}
      </div>
    )
  }

  if (id === 'economic-profile') {
    return (
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Economic Profile</h2>
        <p className="mt-2 text-sm text-muted">Wages, purchasing power, inflation, and the labour market for {country.name} keep your plan grounded in the real economy — not just the fantasy of moving abroad. Verified figures with sources are being added.</p>
        <p className="mt-4 text-xs text-muted">Every metric will show its source, period, and last-verified date.</p>
      </section>
    )
  }

  if (id === 'healthcare') {
    return (
      <section className="card-surface p-6">
        <h2 className="font-display text-2xl font-bold text-navy">Healthcare</h2>
        <p className="mt-2 text-sm text-muted">Public vs. private systems, eligibility, insurance, and access for {country.name} are being verified. We never collect diagnoses in the public experience.</p>
      </section>
    )
  }

  if (id === 'greenbook') {
    return (
      <section className="card-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-teal-deep">Greenbook Insights</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-navy">Community & belonging in {country.name}</h2>
        <p className="mt-2 text-sm text-muted">Community Fit, safety, faith and diaspora communities, accessibility, neighborhoods, and lived experiences — the insight that competitors don't offer. You never have to disclose identity categories to view this. Verified resources, community-reported insights, and editorial context are kept clearly separate.</p>
      </section>
    )
  }

  // resources
  return (
    <section className="card-surface p-6">
      <h2 className="font-display text-2xl font-bold text-navy">Resources</h2>
      <p className="mt-2 text-sm text-muted">Curated official links for {country.name} — immigration, embassy/consulate, taxes, statistics, healthcare, and housing — each labelled official or community, with a last-checked date. Being compiled now.</p>
    </section>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-canvas p-3"><dt className="text-xs text-muted">{label}</dt><dd className="mt-0.5 font-bold text-navy">{value}</dd></div>
}

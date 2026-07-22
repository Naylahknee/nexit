import Link from 'next/link'
import { CheckCircle2, ExternalLink, FileWarning, HelpCircle } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { evaluatePathways, PATHWAYS, RESEARCH_DISCLAIMER, type PathwayEvaluation, type PathwayMatchStatus } from '@/lib/pathways'

const sectionCopy: Record<PathwayMatchStatus, string> = {
  'Strong Match': 'Profile signals align well enough to research these first. This is not an eligibility decision.',
  'Possible Match': 'These may fit, but important application evidence is still missing or unconfirmed.',
  'Missing Requirements': 'Your current profile does not yet show the key starting signals for these routes.',
}

function PathwayCard({ pathway, showStatus = true }: { pathway: PathwayEvaluation; showStatus?: boolean }) {
  const tone = pathway.status === 'Strong Match' ? 'bg-ok/15 text-teal-deep' : pathway.status === 'Possible Match' ? 'bg-gold-soft text-gold-deep' : 'bg-canvas text-muted'
  return (
    <article className="rounded-card border border-line bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-gold-deep">{pathway.category}</p><h3 className="mt-2 text-xl font-extrabold text-navy">{pathway.name}</h3><p className="mt-1 text-sm text-muted">{pathway.country}</p></div>
        {showStatus ? <span className={`rounded-pill px-3 py-1 text-xs font-bold ${tone}`}>{pathway.status}</span> : null}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div><p className="text-xs font-bold uppercase tracking-wide text-muted">Requirements met</p>{pathway.requirementsMet.length ? <ul className="mt-2 space-y-2 text-sm">{pathway.requirementsMet.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 shrink-0 text-ok" />{item}</li>)}</ul> : <p className="mt-2 text-sm text-muted">Complete your Nexit Profile to compare your facts.</p>}</div>
        <div><p className="text-xs font-bold uppercase tracking-wide text-muted">Missing requirements</p>{pathway.missingRequirements.length ? <ul className="mt-2 space-y-2 text-sm">{pathway.missingRequirements.map((item) => <li key={item} className="flex gap-2"><FileWarning size={16} className="mt-0.5 shrink-0 text-gold-deep" />{item}</li>)}</ul> : <p className="mt-2 text-sm text-muted">No profile gaps identified; official evidence is still required.</p>}</div>
      </div>
      <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-sm sm:grid-cols-2">
        <div><dt className="font-bold text-muted">Income threshold</dt><dd className="mt-1">{pathway.incomeThreshold}</dd></div>
        <div><dt className="font-bold text-muted">Dependents</dt><dd className="mt-1">{pathway.dependentsAllowed}</dd></div>
        <div><dt className="font-bold text-muted">Local work rights</dt><dd className="mt-1">{pathway.localWorkRights}</dd></div>
        <div><dt className="font-bold text-muted">Estimated fees</dt><dd className="mt-1">{pathway.estimatedFees}</dd></div>
        <div><dt className="font-bold text-muted">Estimated processing</dt><dd className="mt-1">{pathway.estimatedProcessingTime}</dd></div>
        <div><dt className="font-bold text-muted">Last verified</dt><dd className="mt-1">{pathway.lastVerified}</dd></div>
      </dl>
      <a href={pathway.officialSource} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-gold-deep">{pathway.sourceLabel}<ExternalLink size={14} /></a>
      <p className="mt-4 rounded-xl bg-canvas p-3 text-xs leading-5 text-muted">{RESEARCH_DISCLAIMER}</p>
    </article>
  )
}

export function PathwaysResults({ profile }: { profile: RelocationProfile }) {
  const complete = profile.wizard_status === 'completed'
  const evaluated = complete ? evaluatePathways(profile) : PATHWAYS.map((pathway) => ({ ...pathway, status: 'Missing Requirements' as const, requirementsMet: [], missingRequirements: [] }))
  return (
    <div>
      <header className="rounded-[24px] bg-navy-deep p-7 text-white sm:p-10"><p className="text-sm font-bold text-gold">Nexit Pathways</p><h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">Research the routes that fit your facts.</h1><p className="mt-4 max-w-3xl leading-7 text-white/70">Your Nexit Profile supplies the inputs. This page organizes official pathway research without claiming legal eligibility.</p>{!complete ? <div className="mt-6 rounded-card border border-gold/30 bg-white/8 p-5"><p className="font-bold">Complete your Nexit Profile to see personalized matches.</p><Link href="/profile-wizard" className="gold-button mt-4">Start Wizard</Link></div> : null}</header>
      {complete ? (['Strong Match', 'Possible Match', 'Missing Requirements'] as const).map((status) => {
        const items = evaluated.filter((item) => item.status === status)
        if (!items.length) return null
        return <section key={status} className="mt-10"><div className="flex items-start gap-3"><HelpCircle className="mt-1 text-gold-deep" size={20} /><div><h2 className="font-display text-3xl font-bold text-navy">{status === 'Strong Match' ? 'Strong Matches' : status === 'Possible Match' ? 'Possible Matches' : 'Missing Requirements'}</h2><p className="mt-1 text-muted">{sectionCopy[status]}</p></div></div><div className="mt-5 grid gap-5 xl:grid-cols-2">{items.map((pathway) => <PathwayCard key={pathway.id} pathway={pathway} />)}</div></section>
      }) : null}
      <section className="mt-12 pb-8"><h2 className="font-display text-3xl font-bold text-navy">Explore All Pathways</h2><p className="mt-2 text-muted">Review all supported categories directly from official sources.</p><div className="mt-5 grid gap-5 xl:grid-cols-2">{evaluated.map((pathway) => <PathwayCard key={`all-${pathway.id}`} pathway={pathway} showStatus={complete} />)}</div></section>
    </div>
  )
}

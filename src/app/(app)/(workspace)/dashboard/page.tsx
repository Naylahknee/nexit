import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Globe2, NotebookTabs, Route, UserRound } from 'lucide-react'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES, countryFlag } from '@/lib/countries'
import { getNexitPlan } from '@/lib/nexit-plan'
import { evaluatePathways } from '@/lib/pathways'
import { getProfile, hasCompletedProfile } from '@/lib/profile'

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const [profile, plan] = await Promise.all([getProfile(user.id), getNexitPlan(user.id)])
  const complete = hasCompletedProfile(profile)
  const firstName = profile.display_name || user.email.split('@')[0]
  const strong = complete ? evaluatePathways(profile).filter((item) => item.status === 'Strong Match') : []

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-gold-deep">Your Nexit workspace</p><h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Welcome back, {firstName}.</h1></div><Link href={complete ? '/nexit-plan' : '/profile-wizard'} className="gold-button">{complete ? 'Enter Nexicution Mode' : 'Start Nexit Profile Wizard'} <ArrowRight size={17} /></Link></div>

    {!complete ? <section className="mt-7 rounded-card border border-gold/30 bg-gold-soft/50 p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><p className="font-extrabold text-navy">Complete your Nexit Profile to see personalized matches.</p><p className="mt-1 text-sm text-muted">Until then, no budget, work setup, household type, Match Score, or readiness score is assumed.</p></div><Link href="/profile-wizard" className="gold-button mt-4 shrink-0 sm:mt-0">Start Wizard</Link></section> : null}

    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={UserRound} label="Nexit Profile" value={complete ? 'Complete' : 'Not Started'} href="/profile-wizard" action={complete ? 'Edit profile' : 'Start wizard'} />
      <Stat icon={Route} label="Strong Pathway signals" value={complete ? String(strong.length) : '—'} href="/pathways" action="Review Pathways" />
      <Stat icon={NotebookTabs} label="Nexit Plan stage" value={plan?.timeline_stage ?? 'Not Started'} href="/nexit-plan" action="Open plan" />
      <Stat icon={CheckCircle2} label="Saved plan tasks" value={plan ? String(plan.checklist.length) : '0'} href="/nexit-plan#checklist" action="Open checklist" />
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <section className="card-surface p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Nexit Pathways</p><h2 className="mt-1 text-xl font-extrabold">Recommendation output from your profile</h2>{complete ? <><p className="mt-4 text-sm text-muted">Your saved goals currently produce {strong.length} strong research signal{strong.length === 1 ? '' : 's'}. Official requirements still control eligibility.</p><div className="mt-5 space-y-3">{strong.slice(0, 3).map((item) => <div key={item.id} className="rounded-xl bg-canvas p-4"><p className="font-bold">{item.country} — {item.name}</p><p className="mt-1 text-xs text-ok">{item.status}</p></div>)}{!strong.length ? <p className="rounded-xl bg-canvas p-4 text-sm text-muted">No strong signal yet. Review Possible Matches and missing requirements.</p> : null}</div></> : <p className="mt-4 text-sm text-muted">Finish the Nexit Profile Wizard before recommendations are calculated.</p>}<Link href={complete ? '/pathways' : '/profile-wizard'} className="gold-button mt-6 w-full">{complete ? 'Open Nexit Pathways' : 'Start Wizard'}</Link></section>
      <section className="card-surface p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">General research</p><h2 className="mt-1 text-xl font-extrabold">Browse Nextinations</h2></div><Link href="/countries" className="text-xs font-extrabold text-gold-deep">View all</Link></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{COUNTRIES.slice(0, 3).map((country) => <Link key={country.slug} href={`/countries/${country.slug}`} className="rounded-card border border-line p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className="text-3xl" aria-hidden>{countryFlag(country.code)}</span><p className="mt-3 font-extrabold">{country.name}</p><p className="text-xs text-muted">{country.city}</p><p className="mt-4 text-xs text-muted">Review official Pathways and local research.</p></Link>)}</div></section>
    </div>

    <section className="relative mt-5 min-h-56 overflow-hidden rounded-[20px] bg-navy text-white"><Image src="/images/dashboard-beach-banner.png" alt="Coastline at golden hour" fill sizes="(min-width: 768px) 80vw, 100vw" className="object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/70 to-transparent" /><div className="relative max-w-xl p-8 sm:p-10"><Globe2 className="text-gold" /><h2 className="mt-3 font-display text-3xl font-bold">Turn research into a plan you can act on.</h2><p className="mt-2 text-sm text-white/70">Choose a Nextination, verify a Pathway, and save only your real planning details.</p><Link href="/nexit-plan" className="gold-button mt-5">Open Nexit Plan<ArrowRight size={17} /></Link></div></section>
  </div>
}

function Stat({ icon: Icon, label, value, href, action }: { icon: typeof Globe2; label: string; value: string; href: string; action: string }) { return <article className="card-surface p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-soft"><Icon size={18} /></span><div className="min-w-0"><p className="text-xs font-bold text-muted">{label}</p><p className="mt-1 truncate text-xl font-extrabold">{value}</p></div></div><Link href={href} className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-gold-deep">{action}<ArrowRight size={13} /></Link></article> }

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calculator, CheckCircle2, Globe2, Sparkles, WalletCards } from 'lucide-react'
import { requireCurrentUser } from '@/lib/auth'
import { COUNTRIES, countryFlag } from '@/lib/countries'
import { getProfile } from '@/lib/profile'

const tasks = ['Passport valid', 'Research Pathways', 'Open international bank account', 'Book initial accommodation']

export default async function DashboardPage() {
  const user = await requireCurrentUser()
  const profile = await getProfile(user.id)
  const firstName = profile.display_name || user.email.split('@')[0]
  const eligible = COUNTRIES.filter((country) => profile.monthly_income >= country.incomeRequired)
  const best = [...(eligible.length ? eligible : COUNTRIES)].sort((a, b) => b.match - a.match)[0]
  const completed = profile.completed_tasks.length

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-gold-deep">Your Nexit Plan</p><h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">Welcome back, {firstName}! 👋</h1></div><Link href={profile.onboarding_completed ? '/checklist' : '/onboarding'} className="gold-button">{profile.onboarding_completed ? 'Enter Nexicution Mode' : 'Build my Nexit Profile'} <ArrowRight size={17} /></Link></div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          [Globe2, 'Nextinations reviewed', String(eligible.length || COUNTRIES.length), 'View all', '/countries'],
          [CheckCircle2, 'Tasks completed', `${completed}/${tasks.length}`, 'Keep going', '/checklist'],
          [WalletCards, 'Monthly budget', `$${profile.monthly_income.toLocaleString()}`, 'Edit budget', '/cost-calculator'],
          [Sparkles, 'Best Pathway match', best.visaType, 'View details', `/countries/${best.slug}`],
        ].map(([Icon, label, value, action, href]) => <article key={String(label)} className="card-surface p-5"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-soft"><Icon size={18} /></span><div className="min-w-0"><p className="text-xs font-bold text-muted">{String(label)}</p><p className="mt-1 truncate text-xl font-extrabold">{String(value)}</p></div></div><Link href={String(href)} className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-gold-deep">{String(action)}<ArrowRight size={13} /></Link></article>)}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_1.15fr]">
        <section className="card-surface p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Pathways Wizard</p><h2 className="mt-1 text-xl font-extrabold">Your strongest starting Pathway</h2></div><span className="text-4xl" aria-hidden>{countryFlag(best.code)}</span></div><div className="mt-6 grid gap-5 sm:grid-cols-[1fr_auto]"><div><p className="text-sm text-muted">Based on your ${profile.monthly_income.toLocaleString()} monthly income, {profile.remote ? 'remote work' : 'local-work preference'}, and interest in {profile.preferred_region.toLowerCase()}.</p><div className="mt-5 rounded-xl bg-canvas p-4"><p className="text-xs font-bold text-muted">Recommended Pathway</p><p className="mt-1 text-lg font-extrabold">{best.name} {best.visaType}</p><p className="mt-1 text-xs text-ok">Strong starting Match Score</p></div></div><div className="grid size-24 place-items-center rounded-full" style={{ background: `conic-gradient(#f3c516 0 ${best.match}%, #e7ebf1 ${best.match}%)` }}><div className="grid size-18 place-items-center rounded-full bg-white text-xl font-extrabold">{best.match}%</div></div></div><Link href="/visa-wizard" className="gold-button mt-6 w-full">Refine my Match Score</Link></section>
        <section className="card-surface p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Top Nextinations for you</p><h2 className="mt-1 text-xl font-extrabold">Compare your shortlist</h2></div><Link href="/countries" className="text-xs font-extrabold text-gold-deep">View all</Link></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{COUNTRIES.map((country) => <Link key={country.slug} href={`/countries/${country.slug}`} className="rounded-card border border-line p-4 transition hover:-translate-y-0.5 hover:shadow-md"><span className="text-3xl" aria-hidden>{countryFlag(country.code)}</span><p className="mt-3 font-extrabold">{country.name}</p><p className="text-xs text-muted">{country.city}</p><div className="mt-4 flex justify-between text-xs"><span>{country.cost} cost</span><strong className="text-ok">{country.match}% Match Score</strong></div></Link>)}</div></section>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="card-surface p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Nexit Tracker</p><h2 className="mt-1 text-xl font-extrabold">Move your Nexit Plan forward</h2></div><span className="text-sm font-bold">{completed}/{tasks.length}</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-navy" style={{ width: `${completed / tasks.length * 100}%` }} /></div><div className="mt-5 space-y-3">{tasks.map((task) => <div key={task} className="flex items-center gap-3 text-sm"><CheckCircle2 size={18} className={profile.completed_tasks.includes(task) ? 'text-ok' : 'text-line'} fill={profile.completed_tasks.includes(task) ? 'currentColor' : 'none'} /><span>{task}</span></div>)}</div><Link href="/checklist" className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-gold-deep">Open Nexit Tracker<ArrowRight size={14} /></Link></section>
        <section className="card-surface p-6"><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Monthly budget</p><h2 className="mt-1 text-xl font-extrabold">Estimated move capacity</h2></div><Calculator className="text-gold-deep" /></div><div className="mt-6 flex items-center gap-7"><div className="grid size-28 shrink-0 place-items-center rounded-full" style={{ background: 'conic-gradient(#17305b 0 46%, #f3c516 46% 68%, #6b7a92 68% 82%, #e7ebf1 82%)' }}><div className="grid size-20 place-items-center rounded-full bg-white text-center"><span><strong className="block text-lg">${profile.monthly_income.toLocaleString()}</strong><small className="text-muted">income</small></span></div></div><div className="w-full space-y-2 text-sm">{[['Housing', '46%'], ['Food', '22%'], ['Transport', '14%'], ['Other', '18%']].map(([label, amount]) => <div key={label} className="flex justify-between"><span className="text-muted">{label}</span><strong>{amount}</strong></div>)}</div></div><Link href="/cost-calculator" className="mt-6 inline-flex items-center gap-1 text-sm font-extrabold text-gold-deep">Edit budget<ArrowRight size={14} /></Link></section>
      </div>

      <section className="relative mt-5 min-h-56 overflow-hidden rounded-[20px] bg-navy text-white"><Image src="/images/dashboard-beach-banner.png" alt="Mediterranean beach" fill sizes="(min-width: 768px) 80vw, 100vw" className="object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/70 to-transparent" /><div className="relative max-w-xl p-8 sm:p-10"><p className="text-gold">“</p><h2 className="font-display text-3xl font-bold">The world is too big to stay in one place.</h2><p className="mt-2 text-sm text-white/70">Build the plan. Complete the steps. Create your freedom.</p><Link href="/checklist" className="gold-button mt-5">Enter Nexicution Mode<ArrowRight size={17} /></Link></div></section>
    </div>
  )
}

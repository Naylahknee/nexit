import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, BadgeDollarSign, CheckCircle2, HeartPulse, Landmark, MapPin, ShieldCheck, SunMedium } from 'lucide-react'
import { PassportIndexLink } from '@/components/nexit/PassportIndexLink'
import { COUNTRIES, countryFlag } from '@/lib/countries'

export default async function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const country = COUNTRIES.find((item) => item.slug === slug)
  if (!country) notFound()

  const fitSignals = [
    [SunMedium, 'Lifestyle', 'A varied mix of city life, culture, and outdoor time.'],
    [HeartPulse, 'Daily living', 'Healthcare and essential services are available in major hubs.'],
    [CheckCircle2, 'Pathways fit', `Your planning income can be compared against a $${country.incomeRequired.toLocaleString()} guide.`],
    [MapPin, 'Where to start', `${country.city} is a useful first location to research.`],
  ] as const

  return (
    <div>
      <Link href="/countries" className="inline-flex items-center gap-2 text-sm font-bold text-muted"><ArrowLeft size={16} />All Nextinations</Link>
      <section className="relative mt-5 overflow-hidden rounded-[22px] bg-navy-deep p-7 text-white sm:p-10">
        <div className="absolute -right-6 -top-20 text-[240px] opacity-10" aria-hidden>{countryFlag(country.code)}</div>
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div><span className="text-6xl" aria-hidden>{countryFlag(country.code)}</span><p className="mt-5 flex items-center gap-2 text-sm text-gold"><MapPin size={15} />{country.city} · {country.region}</p><h1 className="mt-2 font-display text-5xl font-bold">Make {country.name} your Nextination.</h1><p className="mt-4 max-w-2xl leading-7 text-white/70">{country.summary}</p></div>
          <div className="rounded-card border border-white/15 bg-white/10 p-5 text-center backdrop-blur"><strong className="block text-4xl text-gold">{country.match}%</strong><span className="text-xs text-white/65">Match Score</span></div>
        </div>
      </section>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-5">
          <section className="card-surface p-6"><p className="text-xs font-bold uppercase tracking-[.16em] text-gold-deep">Pathways</p><h2 className="mt-2 text-2xl font-extrabold">{country.visaType}</h2><p className="mt-3 text-sm leading-6 text-muted">A starting option for applicants who meet financial and documentation requirements. Confirm every detail with {country.name}&apos;s official immigration authority before applying.</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{[[BadgeDollarSign, 'Income guide', `$${country.incomeRequired.toLocaleString()}/month`], [Landmark, 'Estimated cost', country.cost], [ShieldCheck, 'General safety guide', country.safety]].map(([Icon, label, value]) => <div key={String(label)} className="rounded-xl bg-canvas p-4"><Icon size={19} className="text-gold-deep" /><p className="mt-3 text-xs text-muted">{String(label)}</p><p className="mt-1 font-extrabold">{String(value)}</p></div>)}</div></section>
          <section className="card-surface p-6"><h2 className="text-xl font-extrabold">Why it could fit</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{fitSignals.map(([Icon, title, copy]) => <div key={title} className="flex gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gold-soft"><Icon size={18} /></span><div><h3 className="font-extrabold">{title}</h3><p className="mt-1 text-sm leading-5 text-muted">{copy}</p></div></div>)}</div></section>
        </div>
        <aside className="card-surface h-fit p-6"><p className="text-sm font-bold text-gold-deep">Ready to compare?</p><h2 className="mt-2 font-display text-3xl font-bold">Make this Nextination personal.</h2><p className="mt-3 text-sm leading-6 text-muted">Update your Nexit Profile with your income, work setup, family size, and preferred region.</p><Link href="/visa-wizard" className="gold-button mt-6 w-full">Open Pathways Wizard <ArrowRight size={16} /></Link><Link href="/cost-calculator" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-line font-bold">Estimate my costs</Link><PassportIndexLink countrySlug={country.slug} countryName={country.name} /></aside>
      </div>
    </div>
  )
}

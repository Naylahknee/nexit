'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { MapboxMap } from './MapboxMap'
import { getGreenbookEntries } from '@/lib/greenbook'
import { REGIONS, type RegionSlug } from '@/lib/regionData'
import type { NexitnationUserProfile } from '@/lib/userProfile'
import { countryFlag } from '@/lib/countries'

type NextinationPageProps = {
  profile: NexitnationUserProfile
  initialRegion?: RegionSlug
}

export function NextinationPage({ profile, initialRegion }: NextinationPageProps) {
  const activeSlug = initialRegion ?? profile.recommendedRegion
  const activeRegion = REGIONS.find((region) => region.slug === activeSlug) ?? REGIONS[0]
  const greenbookEntries = getGreenbookEntries(initialRegion ? activeRegion.slug : undefined)
  const strongestDestination = [...activeRegion.destinations].sort((a, b) => (
    Math.abs(profile.monthlyIncome - a.monthlyBudget) - Math.abs(profile.monthlyIncome - b.monthlyBudget)
  ))[0]

  return (
    <div>
      {initialRegion ? (
        <Link href="/nexitnation" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-muted transition hover:text-navy">
          <ArrowLeft size={16} /> All regions
        </Link>
      ) : null}

      <section className="relative overflow-hidden rounded-[24px] bg-navy-deep px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="absolute -right-20 -top-28 size-96 rounded-full border-[64px] border-gold/8" />
        <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_330px]">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[.22em] text-gold">Nexitnation</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
              {initialRegion ? `Build your ${activeRegion.shortName} short list.` : 'Explore your next place with context.'}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#bdcae0]">
              Compare regions through the lens of your budget, work setup, and priorities—then learn what daily life can actually feel like.
            </p>
          </div>

          <div className="rounded-[18px] border border-white/12 bg-white/8 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div><p className="text-xs font-bold text-white/55">Your planning readiness</p><p className="mt-1 text-3xl font-extrabold text-gold">{profile.readinessScore}%</p></div>
              <Sparkles className="text-gold" size={26} />
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gold" style={{ width: `${profile.readinessScore}%` }} /></div>
            <p className="mt-3 text-xs leading-5 text-white/60">Based on your onboarding, wizard answers, and completed planning tasks.</p>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.65fr]">
        <MapboxMap regions={REGIONS} activeSlug={activeRegion.slug} />

        <aside className="card-surface flex flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[.16em] text-gold-deep">Current region</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-navy">{activeRegion.name}</h2>
            </div>
            <div className="rounded-xl bg-gold-soft px-3 py-2 text-center"><strong className="block text-xl text-navy">{profile.regionMatches[activeRegion.slug]}%</strong><span className="text-[10px] font-bold text-muted">profile fit</span></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">{activeRegion.description}</p>

          <div className="mt-6 space-y-3">
            {activeRegion.bestFor.map((item) => <p key={item} className="flex items-center gap-2 text-sm font-semibold text-navy"><CheckCircle2 size={17} className="text-ok" />{item}</p>)}
          </div>

          <div className="mt-7 rounded-[16px] bg-canvas p-4">
            <p className="text-xs font-bold text-muted">Strongest budget fit</p>
            <div className="mt-3 flex items-center gap-3"><span className="text-3xl" aria-hidden>{countryFlag(strongestDestination.code)}</span><div><p className="font-extrabold text-navy">{strongestDestination.city}, {strongestDestination.country}</p><p className="text-xs text-muted">About ${strongestDestination.monthlyBudget.toLocaleString()}/month</p></div></div>
          </div>

          <div className="mt-auto pt-6">
            {initialRegion ? (
              <Link href="/visa-wizard" className="gold-button w-full">Refine my matches <ArrowRight size={16} /></Link>
            ) : (
              <Link href={`/nexitnation/${activeRegion.slug}`} className="gold-button w-full">Open this region <ArrowRight size={16} /></Link>
            )}
          </div>
        </aside>
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep">Regional view</p><h2 className="mt-2 font-display text-3xl font-bold text-navy">Choose where to look closer</h2></div>
          <p className="max-w-lg text-sm leading-6 text-muted">Every score is a planning signal, not a promise. Visa rules and real costs should always be verified before you move.</p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {REGIONS.map((region) => (
            <Link key={region.slug} href={`/nexitnation/${region.slug}`} className={`group rounded-[18px] border p-5 transition hover:-translate-y-0.5 hover:shadow-lg ${region.slug === activeRegion.slug ? 'border-gold bg-gold-soft/45' : 'border-line bg-white'}`}>
              <div className="flex items-start justify-between gap-3"><Compass size={22} className="text-gold-deep" /><strong className="text-lg text-navy">{profile.regionMatches[region.slug]}%</strong></div>
              <h3 className="mt-5 font-extrabold text-navy">{region.name}</h3>
              <p className="mt-2 text-xs leading-5 text-muted">{region.eyebrow}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-extrabold text-gold-deep">Explore <ArrowRight size={13} className="transition group-hover:translate-x-0.5" /></span>
            </Link>
          ))}
        </div>
      </section>

      {initialRegion ? (
        <section className="mt-8">
          <div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-gold-deep">Starting shortlist</p><h2 className="mt-2 font-display text-3xl font-bold text-navy">Three places to research first</h2></div>
          <div className="mt-5 grid gap-5 lg:grid-cols-3">
            {activeRegion.destinations.map((destination) => (
              <article key={destination.slug} className="card-surface overflow-hidden">
                <div className="bg-navy px-6 py-5 text-white"><div className="flex items-start justify-between"><span className="text-4xl" aria-hidden>{countryFlag(destination.code)}</span><span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-gold">{destination.fitLabel}</span></div><h3 className="mt-4 text-xl font-extrabold">{destination.city}, {destination.country}</h3><p className="mt-1 text-xs text-white/60">{destination.visaPath}</p></div>
                <div className="p-6"><p className="text-sm leading-6 text-muted">{destination.summary}</p><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-canvas p-3"><BadgeDollarSign size={17} className="text-gold-deep" /><p className="mt-2 text-[10px] text-muted">Monthly guide</p><strong className="text-sm">${destination.monthlyBudget.toLocaleString()}</strong></div><div className="rounded-xl bg-canvas p-3"><ShieldCheck size={17} className="text-gold-deep" /><p className="mt-2 text-[10px] text-muted">Research next</p><strong className="text-sm">Visa details</strong></div></div></div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 overflow-hidden rounded-[24px] bg-teal-deep p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-2xl"><p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[.18em] text-teal-soft"><BookOpenText size={17} />The Nexit Greenbook</p><h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Notes for the life between the paperwork.</h2><p className="mt-3 text-sm leading-6 text-white/72">Practical context about neighborhoods, workdays, arrival logistics, and the questions official forms never answer.</p></div>
          <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold"><UsersRound size={16} /> Community preview</div>
        </div>

        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {greenbookEntries.map((entry) => (
            <article key={entry.id} className="rounded-[18px] bg-white p-5 text-navy shadow-card sm:p-6">
              <div className="flex items-center justify-between gap-4"><p className="flex items-center gap-2 text-xs font-extrabold text-teal-deep"><MapPin size={15} />{entry.location}</p><span className="text-[10px] font-bold text-muted">{entry.context}</span></div>
              <blockquote className="mt-4 font-display text-xl font-bold italic leading-relaxed">“{entry.note}”</blockquote>
              <p className="mt-4 text-xs font-bold text-gold-deep">{entry.author}</p>
              <div className="mt-4 flex flex-wrap gap-2">{entry.tags.map((tag) => <span key={tag} className="rounded-full bg-teal-soft px-3 py-1 text-[10px] font-bold text-teal-deep">{tag}</span>)}</div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-3 rounded-[18px] border border-white/12 bg-white/8 p-5 sm:grid-cols-3">
          {[
            [BriefcaseBusiness, 'Work reality', 'Connectivity, time zones, and professional community'],
            [UsersRound, 'Belonging', 'Neighborhood culture and community access'],
            [ShieldCheck, 'Practical confidence', 'Healthcare, transport, and everyday logistics'],
          ].map(([Icon, title, copy]) => <div key={String(title)} className="flex gap-3"><Icon size={19} className="shrink-0 text-gold" /><div><p className="text-sm font-extrabold">{String(title)}</p><p className="mt-1 text-xs leading-5 text-white/60">{String(copy)}</p></div></div>)}
        </div>
      </section>
    </div>
  )
}

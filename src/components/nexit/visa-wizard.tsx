'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Check, CloudSun, DollarSign, Globe2, Users } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'
import { COUNTRIES, countryFlag } from '@/lib/countries'

const regions = ['Europe', 'Americas', 'Asia-Pacific', 'Open to anywhere'] as const
const climates = ['Warm', 'Four seasons', 'Cool', 'No preference'] as const

export function VisaWizard({ initial }: { initial: RelocationProfile }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const bestMatch = COUNTRIES
    .map((country) => ({ ...country, score: country.match + (profile.monthly_income >= country.incomeRequired ? 5 : -18) + (profile.preferred_region === country.region || profile.preferred_region === 'Open to anywhere' ? 3 : -4) }))
    .sort((a, b) => b.score - a.score)[0]

  async function finish() {
    setSaving(true); setError('')
    try {
      const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ monthly_income: profile.monthly_income, remote: profile.remote, family_size: profile.family_size, preferred_region: profile.preferred_region, climate: profile.climate, wizard_completed: true }) })
      if (!response.ok) throw new Error((await response.json()).error ?? 'Unable to save your answers.')
      router.push('/dashboard'); router.refresh()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save your answers.') } finally { setSaving(false) }
  }

  const panels = [
    <section key="income"><DollarSign className="text-gold-deep" /><p className="mt-4 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Step 1</p><h1 className="mt-2 font-display text-4xl font-bold">What is your monthly income?</h1><p className="mt-3 text-muted">Use your estimated after-tax income in USD.</p><div className="mt-10 rounded-card bg-canvas p-6"><output className="block text-center text-4xl font-extrabold">${profile.monthly_income.toLocaleString()}</output><input aria-label="Monthly income" className="mt-8 w-full accent-gold" type="range" min="500" max="20000" step="100" value={profile.monthly_income} onChange={(event) => setProfile({ ...profile, monthly_income: Number(event.target.value) })} /><div className="mt-2 flex justify-between text-xs text-muted"><span>$500</span><span>$20,000+</span></div></div></section>,
    <section key="remote"><BriefcaseBusiness className="text-gold-deep" /><p className="mt-4 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Step 2</p><h1 className="mt-2 font-display text-4xl font-bold">Can you work remotely?</h1><p className="mt-3 text-muted">This helps us identify digital-nomad and income-based residence paths.</p><div className="mt-8 grid grid-cols-2 gap-4">{[{ value: true, label: 'Yes, remotely' }, { value: false, label: 'No, locally' }].map((choice) => <button key={choice.label} type="button" onClick={() => setProfile({ ...profile, remote: choice.value })} className={`min-h-28 rounded-card border p-5 font-extrabold ${profile.remote === choice.value ? 'border-gold bg-gold-soft/60' : 'border-line bg-white'}`}>{choice.label}</button>)}</div></section>,
    <section key="family"><Users className="text-gold-deep" /><p className="mt-4 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Step 3</p><h1 className="mt-2 font-display text-4xl font-bold">Who is making the move?</h1><p className="mt-3 text-muted">Include yourself and anyone moving with you.</p><div className="mt-10 flex items-center justify-center gap-8 rounded-card bg-canvas p-8"><button type="button" onClick={() => setProfile({ ...profile, family_size: Math.max(1, profile.family_size - 1) })} className="grid size-12 place-items-center rounded-full border border-line bg-white text-2xl font-bold">−</button><output className="min-w-24 text-center"><strong className="block text-5xl">{profile.family_size}</strong><span className="text-sm text-muted">{profile.family_size === 1 ? 'person' : 'people'}</span></output><button type="button" onClick={() => setProfile({ ...profile, family_size: Math.min(12, profile.family_size + 1) })} className="grid size-12 place-items-center rounded-full border border-line bg-white text-2xl font-bold">+</button></div></section>,
    <section key="region"><Globe2 className="text-gold-deep" /><p className="mt-4 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Step 4</p><h1 className="mt-2 font-display text-4xl font-bold">Where feels right?</h1><p className="mt-3 text-muted">Choose a region, or keep your options open.</p><div className="mt-8 grid gap-3 sm:grid-cols-2">{regions.map((region) => <button key={region} type="button" onClick={() => setProfile({ ...profile, preferred_region: region })} className={`flex min-h-20 items-center justify-between rounded-card border p-4 text-left font-bold ${profile.preferred_region === region ? 'border-gold bg-gold-soft/60' : 'border-line bg-white'}`}>{region}{profile.preferred_region === region ? <Check size={18} /> : null}</button>)}</div></section>,
    <section key="climate"><CloudSun className="text-gold-deep" /><p className="mt-4 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Step 5</p><h1 className="mt-2 font-display text-4xl font-bold">Your match is ready.</h1><p className="mt-3 text-muted">Pick a climate preference, then save your personalized plan.</p><div className="mt-6 grid grid-cols-2 gap-2">{climates.map((climate) => <button key={climate} type="button" onClick={() => setProfile({ ...profile, climate })} className={`rounded-xl border px-3 py-3 text-sm font-bold ${profile.climate === climate ? 'border-gold bg-gold-soft/60' : 'border-line bg-white'}`}>{climate}</button>)}</div><div className="mt-6 flex items-center gap-5 rounded-card bg-navy p-5 text-white"><span className="text-4xl" aria-hidden>{countryFlag(bestMatch.code)}</span><div><p className="text-xs font-bold uppercase tracking-[.16em] text-gold">Best match</p><h2 className="mt-1 text-xl font-extrabold">{bestMatch.name} · {bestMatch.visaType}</h2><p className="mt-1 text-sm text-white/65">{Math.max(65, Math.min(98, bestMatch.score))}% profile match</p></div></div></section>,
  ]

  return (
    <div className="mx-auto max-w-3xl"><div className="mb-8 flex items-center justify-between"><div><p className="text-sm font-bold text-muted">Visa Wizard</p><p className="text-xs text-muted">Step {step + 1} of 5</p></div><div className="flex w-40 gap-1.5">{panels.map((_, index) => <span key={index} className={`h-2 flex-1 rounded-full ${index <= step ? 'bg-gold' : 'bg-line'}`} />)}</div></div><div className="card-surface p-6 sm:p-10">{panels[step]}{error ? <p role="alert" className="mt-5 text-sm font-semibold text-danger">{error}</p> : null}<div className="mt-10 flex justify-between"><button type="button" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-bold text-muted disabled:opacity-0"><ArrowLeft size={17} />Back</button>{step < 4 ? <button type="button" onClick={() => setStep(step + 1)} className="gold-button">Next<ArrowRight size={17} /></button> : <button type="button" onClick={finish} disabled={saving} className="gold-button">{saving ? 'Saving…' : 'See my dashboard'}<ArrowRight size={17} /></button>}</div></div><p className="mx-auto mt-4 max-w-xl text-center text-xs leading-5 text-muted">Recommendations are for planning only. Always verify current requirements with the official immigration authority.</p></div>
  )
}

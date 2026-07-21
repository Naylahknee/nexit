'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Compass, Globe2, HeartHandshake } from 'lucide-react'
import type { RelocationProfile } from '@/lib/profile'

const timelines = ['0-3 months', '3-6 months', '6-12 months', 'Just exploring'] as const
const priorities = ['Affordability', 'Safety', 'Warm weather', 'Career options'] as const

export function OnboardingFlow({ initial }: { initial: RelocationProfile }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function finish() {
    setSaving(true); setError('')
    try {
      const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ display_name: profile.display_name, current_country: profile.current_country, timeline: profile.timeline, priority: profile.priority, onboarding_completed: true }) })
      if (!response.ok) throw new Error((await response.json()).error ?? 'Unable to save.')
      router.push('/visa-wizard'); router.refresh()
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Unable to save.') } finally { setSaving(false) }
  }

  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[.85fr_1.15fr]">
      <aside className="hero-grid relative hidden overflow-hidden bg-navy-deep p-12 text-white lg:flex lg:flex-col lg:justify-between"><div><p className="text-sm font-extrabold uppercase tracking-[.2em] text-gold">Welcome to Nexit</p><h1 className="mt-5 max-w-md font-display text-5xl font-bold leading-tight">One clear plan for your life abroad.</h1><p className="mt-5 max-w-md leading-7 text-white/65">Tell us what matters most. We&apos;ll use it to shape your visa matches, budget, and move plan.</p></div><Globe2 size={180} strokeWidth={0.6} className="self-center text-gold/50" /></aside>
      <main className="flex min-h-screen items-center justify-center p-5 sm:p-10">
        <div className="w-full max-w-xl">
          <div className="mb-10 flex gap-2" aria-label={`Step ${step + 1} of 3`}>{[0, 1, 2].map((item) => <span key={item} className={`h-2 flex-1 rounded-full ${item <= step ? 'bg-gold' : 'bg-line'}`} />)}</div>
          {step === 0 ? <section><Compass className="text-gold-deep" /><p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">First, the basics</p><h2 className="mt-2 font-display text-4xl font-bold text-navy">Where are you starting from?</h2><div className="mt-8 space-y-5"><label className="block text-sm font-bold">What should we call you?<input className="field mt-2" value={profile.display_name} onChange={(event) => setProfile({ ...profile, display_name: event.target.value })} placeholder="Your first name" /></label><label className="block text-sm font-bold">Where do you live now?<input className="field mt-2" value={profile.current_country} onChange={(event) => setProfile({ ...profile, current_country: event.target.value })} placeholder="Country" /></label></div></section> : null}
          {step === 1 ? <section><Globe2 className="text-gold-deep" /><p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Your timeline</p><h2 className="mt-2 font-display text-4xl font-bold text-navy">When would you like to move?</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{timelines.map((value) => <button key={value} type="button" onClick={() => setProfile({ ...profile, timeline: value })} className={`flex min-h-20 items-center justify-between rounded-card border p-4 text-left font-bold ${profile.timeline === value ? 'border-gold bg-gold-soft/60' : 'border-line bg-white'}`}>{value}{profile.timeline === value ? <Check size={18} /> : null}</button>)}</div></section> : null}
          {step === 2 ? <section><HeartHandshake className="text-gold-deep" /><p className="mt-5 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">What matters most</p><h2 className="mt-2 font-display text-4xl font-bold text-navy">Choose your top priority.</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{priorities.map((value) => <button key={value} type="button" onClick={() => setProfile({ ...profile, priority: value })} className={`flex min-h-20 items-center justify-between rounded-card border p-4 text-left font-bold ${profile.priority === value ? 'border-gold bg-gold-soft/60' : 'border-line bg-white'}`}>{value}{profile.priority === value ? <Check size={18} /> : null}</button>)}</div></section> : null}
          {error ? <p role="alert" className="mt-6 text-sm font-semibold text-danger">{error}</p> : null}
          <div className="mt-10 flex items-center justify-between"><button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="inline-flex min-h-12 items-center gap-2 rounded-xl px-3 font-bold text-muted disabled:opacity-0"><ArrowLeft size={17} />Back</button>{step < 2 ? <button type="button" onClick={() => setStep(step + 1)} disabled={step === 0 && (!profile.display_name.trim() || !profile.current_country.trim())} className="gold-button">Continue<ArrowRight size={17} /></button> : <button type="button" onClick={finish} disabled={saving} className="gold-button">{saving ? 'Saving…' : 'Build my plan'}<ArrowRight size={17} /></button>}</div>
        </div>
      </main>
    </div>
  )
}

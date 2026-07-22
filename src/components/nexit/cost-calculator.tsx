'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Download, LoaderCircle, RefreshCcw, Save } from 'lucide-react'

type Budget = { housing: number | null; food: number | null; transport: number | null; healthcare: number | null; other: number | null }
const blankBudget: Budget = { housing: null, food: null, transport: null, healthcare: null, other: null }

export function CostCalculator({ income, profileComplete }: { income: number | null; profileComplete: boolean }) {
  const [monthlyIncome, setMonthlyIncome] = useState<number | null>(income)
  const [budget, setBudget] = useState<Budget>(blankBudget)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const amounts = Object.values(budget).filter((value): value is number => value !== null)
  const total = amounts.reduce((sum, value) => sum + value, 0)
  const remaining = monthlyIncome === null || !amounts.length ? null : monthlyIncome - total

  function reset() { setMonthlyIncome(income); setBudget(blankBudget); setMessage('Calculator cleared.') }
  async function saveIncome() {
    if (monthlyIncome === null || !profileComplete) return
    setSaving(true); setMessage('')
    try {
      const response = await fetch('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ monthly_income: monthlyIncome }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save your income.')
      setMessage('Monthly income saved to your Nexit Profile.')
    } catch (reason) { setMessage(reason instanceof Error ? reason.message : 'Unable to save your income.') }
    finally { setSaving(false) }
  }
  function download() {
    if (monthlyIncome === null && !amounts.length) return
    const lines = ['Nexit monthly cost research', `Monthly income,${monthlyIncome ?? ''}`, ...Object.entries(budget).map(([name, amount]) => `${name},${amount ?? ''}`), `Total entered expenses,${total}`, `Remaining,${remaining ?? ''}`]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'nexit-cost-research.csv'; anchor.click(); URL.revokeObjectURL(url); setMessage('Cost research exported.')
  }

  return <div>
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-gold-deep">Planning tool</p><h1 className="mt-1 font-display text-4xl font-bold">Cost Calculator</h1><p className="mt-3 text-muted">Enter your own figures. Nexit does not preload a sample budget.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold"><RefreshCcw size={16} />Clear</button><button type="button" onClick={download} disabled={monthlyIncome === null && !amounts.length} className="gold-button !min-h-11"><Download size={16} />Export</button></div></div>
    {!profileComplete ? <div className="mt-6 rounded-card border border-gold/30 bg-gold-soft/50 p-5"><p className="font-bold">Complete your Nexit Profile to save personalized cost inputs.</p><p className="mt-1 text-sm text-muted">You may still use this calculator for unsaved general research.</p><Link href="/profile-wizard" className="mt-3 inline-flex text-sm font-extrabold text-gold-deep">Start Wizard</Link></div> : null}
    <div className="mt-7 grid gap-5 xl:grid-cols-[1fr_.75fr]"><section className="card-surface p-6"><h2 className="text-xl font-extrabold">Monthly expenses</h2><div className="mt-6 space-y-5">{(Object.keys(budget) as (keyof Budget)[]).map((name) => <label key={name} className="grid gap-2 sm:grid-cols-[1fr_180px] sm:items-center"><span className="font-bold capitalize">{name}</span><span className="relative"><span className="absolute inset-y-0 left-4 flex items-center text-muted">$</span><input aria-label={`${name} expense`} className="field pl-8" type="number" min="0" max="100000" value={budget[name] ?? ''} placeholder="Not entered" onChange={(event) => setBudget({ ...budget, [name]: event.target.value ? Math.max(0, Number(event.target.value)) : null })} /></span></label>)}</div></section>
      <aside className="space-y-5"><section className="card-surface p-6"><label className="text-sm font-bold text-muted">Monthly income<span className="relative mt-2 block"><span className="absolute inset-y-0 left-4 flex items-center text-muted">$</span><input aria-label="Monthly income" className="field pl-8 text-xl font-extrabold" type="number" min="0" max="1000000" step="100" value={monthlyIncome ?? ''} placeholder="Not entered" onChange={(event) => setMonthlyIncome(event.target.value ? Math.max(0, Number(event.target.value)) : null)} /></span></label><div className="mt-6 rounded-card bg-canvas p-6 text-center"><small className="block text-muted">Entered expenses</small><strong className="mt-1 block text-3xl">{amounts.length ? `$${total.toLocaleString()}` : 'Not entered'}</strong></div>{profileComplete ? <button type="button" onClick={saveIncome} disabled={saving || monthlyIncome === null} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy px-4 text-sm font-bold text-white disabled:opacity-60">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{saving ? 'Saving…' : 'Save income to Nexit Profile'}</button> : null}</section>
      <section className={`rounded-card p-6 text-white ${remaining !== null && remaining < 0 ? 'bg-danger' : 'bg-navy'}`}><p className="text-sm font-bold opacity-70">After entered expenses</p><p className="mt-2 text-3xl font-extrabold">{remaining === null ? 'Not calculated' : `${remaining < 0 ? '−' : ''}$${Math.abs(remaining).toLocaleString()}`}</p></section></aside>
    </div>{message ? <p role="status" className="mt-4 text-sm font-semibold text-muted">{message}</p> : null}
  </div>
}

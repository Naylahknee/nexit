'use client'

import { useState } from 'react'
import { Download, RefreshCcw } from 'lucide-react'

const defaults = { housing: 1100, food: 450, transport: 200, healthcare: 250, other: 350 }

export function CostCalculator({ income }: { income: number }) {
  const [budget, setBudget] = useState(defaults)
  const total = Object.values(budget).reduce((sum, value) => sum + value, 0)
  const remaining = income - total

  function download() {
    const lines = ['Nexit monthly budget', `Monthly income,$${income}`, ...Object.entries(budget).map(([name, amount]) => `${name},$${amount}`), `Total expenses,$${total}`, `Remaining,$${remaining}`]
    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'nexit-budget.csv'; anchor.click(); URL.revokeObjectURL(url)
  }

  return (
    <div><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-gold-deep">Monthly planner</p><h1 className="mt-1 font-display text-4xl font-bold">Cost calculator</h1><p className="mt-3 text-muted">Adjust your estimates to see how a move fits your income.</p></div><div className="flex gap-2"><button type="button" onClick={() => setBudget(defaults)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line bg-white px-4 text-sm font-bold"><RefreshCcw size={16} />Reset</button><button type="button" onClick={download} className="gold-button !min-h-11"><Download size={16} />Export</button></div></div><div className="mt-7 grid gap-5 xl:grid-cols-[1fr_.75fr]"><section className="card-surface p-6"><h2 className="text-xl font-extrabold">Monthly expenses</h2><div className="mt-6 space-y-5">{Object.entries(budget).map(([name, value]) => <label key={name} className="grid gap-2 sm:grid-cols-[1fr_180px] sm:items-center"><span className="font-bold capitalize">{name}</span><span className="relative"><span className="absolute inset-y-0 left-4 flex items-center text-muted">$</span><input className="field pl-8" type="number" min="0" max="100000" value={value} onChange={(event) => setBudget({ ...budget, [name]: Math.max(0, Number(event.target.value)) })} /></span></label>)}</div></section><aside className="space-y-5"><section className="card-surface p-6"><p className="text-sm font-bold text-muted">Monthly income</p><p className="mt-2 text-4xl font-extrabold">${income.toLocaleString()}</p><div className="mt-6 grid size-52 place-items-center rounded-full mx-auto" style={{ background: `conic-gradient(#17305b 0 ${Math.min(100, total / Math.max(income, 1) * 100)}%, #f3c516 0)` }}><div className="grid size-36 place-items-center rounded-full bg-white text-center"><span><small className="block text-muted">Expenses</small><strong className="block text-2xl">${total.toLocaleString()}</strong></span></div></div></section><section className={`rounded-card p-6 text-white ${remaining >= 0 ? 'bg-navy' : 'bg-danger'}`}><p className="text-sm font-bold opacity-70">After expenses</p><p className="mt-2 text-3xl font-extrabold">{remaining < 0 ? '−' : ''}${Math.abs(remaining).toLocaleString()}</p><p className="mt-2 text-sm opacity-70">{remaining >= 0 ? 'Available for savings, visas, and moving costs.' : 'Your estimate is above your current income.'}</p></section></aside></div></div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, FileText, LoaderCircle, Plus, Save, Sparkles, Trash2 } from 'lucide-react'
import type { NexitPlan, PlanBudget, PlanStage } from '@/lib/nexit-plan'

const stages: PlanStage[] = ['Explore', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle']
const defaultTasks = ['Confirm passport validity', 'Verify official Pathway requirements', 'Build application document list', 'Research housing areas', 'Review healthcare coverage']
const budgetLabels: Record<keyof PlanBudget, string> = { housing: 'Housing', food: 'Food', transport: 'Transport', healthcare: 'Healthcare', other: 'Other' }

export function NexitPlanWorkspace({ initial, nextinations, pathways, profileHousehold }: { initial: NexitPlan; nextinations: string[]; pathways: string[]; profileHousehold: number | null }) {
  const [plan, setPlan] = useState({ ...initial, household_members: initial.household_members ?? profileHousehold })
  const [task, setTask] = useState('')
  const [document, setDocument] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const hasSavedPlan = initial.updated_at !== null
  const progressChecks = [Boolean(plan.saved_nextination), Boolean(plan.selected_pathway), Boolean(plan.target_move_date), plan.checklist.length > 0, Object.values(plan.budget).some((value) => value !== null), plan.documents.length > 0]
  const progress = !hasSavedPlan && !progressChecks.some(Boolean) ? null : Math.round(progressChecks.filter(Boolean).length / progressChecks.length * 100)

  function update<K extends keyof NexitPlan>(key: K, value: NexitPlan[K]) { setPlan((current) => ({ ...current, [key]: value })) }
  async function save(nextPlan = plan) {
    setSaving(true); setMessage('')
    try {
      const response = await fetch('/api/plan', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nextPlan) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Unable to save your plan.')
      setPlan(result); setMessage('Your Nexit Plan is saved.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save your plan.') }
    finally { setSaving(false) }
  }
  async function enterMode() {
    const next = { ...plan, timeline_stage: 'Prepare' as const }
    setPlan(next); await save(next)
  }
  function addList(key: 'checklist' | 'documents', value: string, clear: () => void) {
    const clean = value.trim(); if (!clean || plan[key].includes(clean)) return
    update(key, [...plan[key], clean]); clear()
  }

  return <div>
    <header className="rounded-[24px] bg-navy-deep p-7 text-white sm:p-10"><p className="text-sm font-bold text-gold">Private workspace</p><div className="mt-2 flex flex-wrap items-end justify-between gap-5"><div><h1 className="font-display text-4xl font-bold sm:text-5xl">Your Nexit Plan</h1><p className="mt-3 max-w-2xl text-white/70">Save decisions, evidence, dates, and preparation work in one place.</p></div><div className="rounded-card border border-white/12 bg-white/8 p-4 text-right"><p className="text-xs font-bold text-white/55">Nexit Readiness</p><p className="mt-1 text-2xl font-extrabold text-gold">{progress === null ? 'Not Started' : `${progress}%`}</p></div></div></header>
    <section className="mt-6 card-surface p-6"><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4"><Select label="Saved Nextination" value={plan.saved_nextination} options={nextinations} onChange={(value) => update('saved_nextination', value)} /><Select label="Selected Pathway" value={plan.selected_pathway} options={pathways} onChange={(value) => update('selected_pathway', value)} /><label className="text-sm font-bold">Target move date<input className="field mt-2" type="date" value={plan.target_move_date ?? ''} onChange={(event) => update('target_move_date', event.target.value || null)} /></label><label className="text-sm font-bold">Household members<input className="field mt-2" type="number" min="1" max="20" value={plan.household_members ?? ''} onChange={(event) => update('household_members', event.target.value ? Number(event.target.value) : null)} /></label></div></section>
    <section className="mt-6 card-surface p-6"><h2 className="text-xl font-extrabold">Nexit Timeline</h2><div className="mt-5 grid gap-2 sm:grid-cols-3 xl:grid-cols-6">{stages.map((stage, index) => <button key={stage} type="button" onClick={() => update('timeline_stage', stage)} className={`rounded-xl border px-3 py-4 text-sm font-bold ${plan.timeline_stage === stage ? 'border-gold bg-gold text-navy' : 'border-line bg-canvas text-muted'}`}><span className="block text-xs opacity-65">{index + 1}</span>{stage}</button>)}</div></section>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><ListEditor title="Checklist" icon={<Check size={18} />} items={plan.checklist} value={task} setValue={setTask} onAdd={() => addList('checklist', task, () => setTask(''))} onRemove={(item) => update('checklist', plan.checklist.filter((value) => value !== item))} suggestions={defaultTasks} onSuggestion={(item) => { if (!plan.checklist.includes(item)) update('checklist', [...plan.checklist, item]) }} /><ListEditor title="Documents" icon={<FileText size={18} />} items={plan.documents} value={document} setValue={setDocument} onAdd={() => addList('documents', document, () => setDocument(''))} onRemove={(item) => update('documents', plan.documents.filter((value) => value !== item))} /></div>
    <div className="mt-6 grid gap-6 xl:grid-cols-2"><section className="card-surface p-6"><h2 className="text-xl font-extrabold">Budget</h2><p className="mt-1 text-sm text-muted">Blank until you enter your own planning figures.</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{(Object.keys(budgetLabels) as (keyof PlanBudget)[]).map((key) => <label key={key} className="text-sm font-bold">{budgetLabels[key]}<input className="field mt-2" type="number" min="0" value={plan.budget[key] ?? ''} onChange={(event) => update('budget', { ...plan.budget, [key]: event.target.value ? Number(event.target.value) : null })} /></label>)}</div></section><section className="card-surface p-6"><h2 className="text-xl font-extrabold">Notes</h2><textarea className="field mt-4 min-h-48 py-3" value={plan.notes ?? ''} onChange={(event) => update('notes', event.target.value || null)} placeholder="Record questions, decisions, and follow-ups." /></section></div>
    <section className="mt-6 grid gap-5 md:grid-cols-2"><article className="rounded-card bg-teal-soft p-6"><p className="font-bold text-teal-deep">Greenbook resources</p><h2 className="mt-1 text-xl font-extrabold">Add community context to your plan.</h2><p className="mt-2 text-sm text-muted">Review sourced neighborhood and lived-experience research before making decisions.</p><Link href="/greenbook" className="mt-4 inline-flex font-bold text-teal-deep">Open Greenbook Insights</Link></article><article className="rounded-card bg-navy p-6 text-white"><Sparkles className="text-gold" /><h2 className="mt-3 text-xl font-extrabold">Ready to move from planning to doing?</h2><button type="button" disabled={saving || !plan.saved_nextination || !plan.selected_pathway} onClick={enterMode} className="gold-button mt-5">Enter Nexicution Mode</button><p className="mt-2 text-xs text-white/55">Choose a Nextination and Pathway first.</p></article></section>
    <div className="sticky bottom-4 mt-6 flex flex-wrap items-center justify-end gap-4 rounded-card border border-line bg-white/95 p-4 shadow-card backdrop-blur"><p role="status" className="mr-auto text-sm font-semibold text-muted">{message}</p><button type="button" disabled={saving} onClick={() => save()} className="gold-button">{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}{saving ? 'Saving…' : 'Save Nexit Plan'}</button></div>
  </div>
}

function Select({ label, value, options, onChange }: { label: string; value: string | null; options: string[]; onChange: (value: string | null) => void }) { return <label className="text-sm font-bold">{label}<select className="field mt-2" value={value ?? ''} onChange={(event) => onChange(event.target.value || null)}><option value="">Not selected</option>{options.map((item) => <option key={item}>{item}</option>)}</select></label> }
function ListEditor({ title, icon, items, value, setValue, onAdd, onRemove, suggestions = [], onSuggestion }: { title: string; icon: React.ReactNode; items: string[]; value: string; setValue: (value: string) => void; onAdd: () => void; onRemove: (item: string) => void; suggestions?: string[]; onSuggestion?: (item: string) => void }) { return <section className="card-surface p-6"><div className="flex items-center gap-2"><span className="text-gold-deep">{icon}</span><h2 className="text-xl font-extrabold">{title}</h2></div><div className="mt-4 flex gap-2"><input className="field" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); onAdd() } }} placeholder={`Add ${title.toLowerCase()} item`} /><button type="button" onClick={onAdd} className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy text-white"><Plus size={18} /></button></div>{suggestions.length ? <div className="mt-3 flex flex-wrap gap-2">{suggestions.map((item) => <button key={item} type="button" onClick={() => onSuggestion?.(item)} className="rounded-pill bg-canvas px-3 py-1.5 text-xs font-bold text-muted">+ {item}</button>)}</div> : null}<ul className="mt-5 space-y-2">{items.map((item) => <li key={item} className="flex items-center justify-between gap-3 rounded-xl bg-canvas px-4 py-3 text-sm"><span>{item}</span><button type="button" aria-label={`Remove ${item}`} onClick={() => onRemove(item)} className="text-muted hover:text-danger"><Trash2 size={16} /></button></li>)}{!items.length ? <li className="text-sm text-muted">No items added.</li> : null}</ul></section> }

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Search, SlidersHorizontal } from 'lucide-react'
import { COUNTRIES, countryFlag } from '@/lib/countries'

type ApiCountry = { id: number; name: string; visa_type: string; income_required: number; country_code: string | null }

export function CountriesBrowser({ initialQuery = '' }: { initialQuery?: string }) {
  const [countries, setCountries] = useState<ApiCountry[]>([])
  const [query, setQuery] = useState(initialQuery)
  const [region, setRegion] = useState('All')
  const [status, setStatus] = useState('Loading your country options…')

  useEffect(() => {
    let active = true
    fetch('/api/countries').then(async (response) => {
      const data = await response.json()
      if (!response.ok) throw new Error(data.error ?? 'Unable to load countries.')
      if (active) { setCountries(data); setStatus('') }
    }).catch((reason) => { if (active) setStatus(reason instanceof Error ? reason.message : 'Unable to load countries.') })
    return () => { active = false }
  }, [])

  const filtered = countries.filter((country) => {
    const detail = COUNTRIES.find((item) => item.name === country.name)
    const matchesText = `${country.name} ${country.visa_type}`.toLowerCase().includes(query.toLowerCase())
    return matchesText && (region === 'All' || detail?.region === region)
  })

  return (
    <div>
      <div><p className="text-sm font-bold text-gold-deep">Nextination directory</p><h1 className="mt-1 font-display text-4xl font-bold">Find a Nextination that fits your life.</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-muted">Compare Pathways, income guides, estimated cost, Match Score, and Community Fit.</p></div>
      <div className="card-surface mt-7 flex flex-col gap-3 p-4 sm:flex-row"><label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-line px-4"><Search size={18} className="text-muted" /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search countries" className="min-w-0 flex-1 outline-none" placeholder="Search countries or visas…" /></label><label className="flex min-h-12 items-center gap-2 rounded-xl border border-line px-4 text-sm font-bold"><SlidersHorizontal size={17} /><span className="sr-only">Region</span><select value={region} onChange={(event) => setRegion(event.target.value)} className="bg-white outline-none"><option>All</option><option>Europe</option><option>Americas</option></select></label></div>
      {status ? <p className="mt-7 text-sm text-muted">{status}</p> : null}
      {!status && !filtered.length ? <div className="card-surface mt-7 p-8 text-center"><p className="font-extrabold">No matches found</p><p className="mt-2 text-sm text-muted">Try a broader search or switch the region filter.</p></div> : null}
      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((country) => {
        const detail = COUNTRIES.find((item) => item.name === country.name)
        if (!detail) return null
        return <article key={country.id} className="card-surface overflow-hidden"><div className="relative h-36 bg-gradient-to-br from-navy to-navy-deep p-5 text-white"><div className="absolute -right-5 -top-8 text-[110px] opacity-20" aria-hidden>{countryFlag(detail.code)}</div><span className="relative text-5xl" aria-hidden>{countryFlag(detail.code)}</span><p className="relative mt-3 text-xs font-bold text-gold">{detail.region}</p></div><div className="p-5"><div className="flex justify-between gap-4"><div><h2 className="text-xl font-extrabold">{country.name}</h2><p className="text-sm text-muted">{detail.city}</p></div><strong className="text-ok">{detail.match}% Match Score</strong></div><div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-canvas p-4 text-xs"><div><span className="block text-muted">Pathways</span><strong>{country.visa_type}</strong></div><div><span className="block text-muted">Income guide</span><strong>${country.income_required.toLocaleString()}/mo</strong></div><div><span className="block text-muted">Cost</span><strong>{detail.cost}</strong></div><div><span className="block text-muted">Community Fit</span><strong>Research locally</strong></div></div><Link href={`/countries/${detail.slug}`} className="gold-button mt-5 w-full">View Nextination <ArrowRight size={16} /></Link></div></article>
      })}</div>
    </div>
  )
}

'use client'

import { FormEvent, useState } from 'react'
import { getVisa } from '@/lib/visa'

type Country = {
  id: number
  name: string
  visa_type: string
  income_required: number
}

export default function Home() {
  const [email, setEmail] = useState('user@test.com')
  const [password, setPassword] = useState('')
  const [income, setIncome] = useState('')
  const [remote, setRemote] = useState(false)
  const [token, setToken] = useState('')
  const [countries, setCountries] = useState<Country[]>([])
  const [message, setMessage] = useState('Sign in to explore country options.')
  const [loading, setLoading] = useState(false)

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error ?? 'Unable to sign in')

      setToken(data.token)
      setMessage('Signed in. Your session lasts seven days.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  async function loadCountries() {
    if (!token) {
      setMessage('Sign in before loading countries.')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/countries', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error ?? 'Unable to load countries')

      setCountries(data)
      setMessage(`Loaded ${data.length} country options.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to load countries')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#07100d] px-5 py-8 text-stone-100 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.32em] text-emerald-400">NEXIT</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Find your next place.</h1>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
            Visa explorer
          </span>
        </header>

        <div className="grid gap-6 py-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <p className="text-sm text-stone-400">Secure access</p>
            <h2 className="mt-1 text-2xl font-medium">Create an account or sign in</h2>
            <form onSubmit={login} className="mt-6 space-y-4">
              <label className="block text-sm text-stone-300">
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-emerald-400"
                />
              </label>
              <label className="block text-sm text-stone-300">
                Password
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="At least 8 characters"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none transition focus:border-emerald-400"
                />
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-400 px-4 py-3 font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Working…' : 'Continue'}
              </button>
            </form>
            <p aria-live="polite" className="mt-4 min-h-5 text-sm text-stone-400">{message}</p>
          </section>

          <section className="rounded-3xl bg-[#e8f0df] p-6 text-[#142019] sm:p-8">
            <p className="text-sm font-medium text-emerald-800">Eligibility snapshot</p>
            <h2 className="mt-1 text-2xl font-medium">What fits your situation?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium">
                Monthly income (USD)
                <input
                  type="number"
                  min="0"
                  inputMode="numeric"
                  value={income}
                  onChange={(event) => setIncome(event.target.value)}
                  placeholder="2500"
                  className="mt-2 w-full rounded-xl border border-emerald-950/15 bg-white/70 px-4 py-3 outline-none focus:border-emerald-700"
                />
              </label>
              <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-emerald-950/15 bg-white/50 px-4 py-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={remote}
                  onChange={(event) => setRemote(event.target.checked)}
                  className="size-4 accent-emerald-700"
                />
                I work remotely
              </label>
            </div>
            <div className="mt-6 rounded-2xl bg-[#142019] p-5 text-stone-100">
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Recommended</p>
              <p className="mt-2 text-2xl font-medium">{getVisa(Number(income), remote)}</p>
              <p className="mt-2 text-sm text-stone-400">A starting point only—always confirm current rules with an official authority.</p>
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-400">Protected directory</p>
              <h2 className="mt-1 text-2xl font-medium">Country programs</h2>
            </div>
            <button
              type="button"
              onClick={loadCountries}
              disabled={loading || !token}
              className="rounded-xl border border-emerald-400/40 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Load countries
            </button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {countries.length ? countries.map((country) => (
              <article key={country.id} className="rounded-2xl border border-white/10 bg-black/15 p-5">
                <h3 className="text-lg font-medium">{country.name}</h3>
                <p className="mt-1 text-sm text-emerald-300">{country.visa_type}</p>
                <p className="mt-4 text-sm text-stone-400">From ${country.income_required.toLocaleString()}/month</p>
              </article>
            )) : (
              <p className="text-sm text-stone-500">Sign in and load the protected country list.</p>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

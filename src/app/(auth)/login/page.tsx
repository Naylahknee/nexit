import { AuthForm } from '@/components/nexit/auth-form'
import { Wordmark } from '@/components/nexit/wordmark'

export default function LoginPage() {
  return <main className="grid min-h-screen place-items-center bg-canvas px-5 py-12"><section className="card-surface w-full max-w-md p-7 sm:p-10"><Wordmark /><p className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-gold-deep">Welcome back</p><h1 className="mt-2 font-display text-4xl font-bold text-navy">Continue your journey.</h1><p className="mt-3 text-sm leading-6 text-muted">Sign in to return to your saved visa plan, budget, and move checklist.</p><AuthForm mode="login" /></section></main>
}

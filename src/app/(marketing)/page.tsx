import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calculator, CheckCircle2, Globe2, Sparkles } from 'lucide-react'
import { MarketingMobileNav } from '@/components/nexit/marketing-mobile-nav'
import { Wordmark } from '@/components/nexit/wordmark'

const journey = [
  { image: '/images/journey-globe-pins.png', title: 'Explore countries', copy: 'Compare countries, visa paths, and monthly costs side by side.', action: 'Explore options' },
  { image: '/images/passport-visa-documents.png', title: 'Find your visa', copy: 'Answer a few questions and get a practical starting shortlist.', action: 'Get matched' },
  { image: '/images/luggage-tropical-coast.png', title: 'Plan your move', copy: 'Track documents, budget, and the tasks that turn a plan into a departure.', action: 'Start planning' },
]

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="hero-grid relative overflow-hidden bg-navy-deep text-white">
        <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
          <Wordmark dark />
          <nav className="hidden items-center gap-7 text-sm font-semibold text-white/75 md:flex" aria-label="Landing navigation">
            <a href="#how-it-works" className="hover:text-white">How it works</a>
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#destinations" className="hover:text-white">Destinations</a>
            <Link href="/login" className="hover:text-white">Sign in</Link>
            <Link href="/signup" className="gold-button !min-h-10 !px-4">Get started</Link>
          </nav>
          <MarketingMobileNav />
        </header>

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-8 px-5 pb-28 pt-12 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:pb-32 lg:pt-16">
          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-gold">Your move, made clearer</p>
            <h1 className="font-display text-5xl font-bold leading-[1.04] sm:text-6xl lg:text-7xl">Plan your exit.<br /><span className="italic text-gold">Build your next life abroad.</span></h1>
            <p className="mt-7 max-w-lg text-base leading-7 text-white/72 sm:text-lg">Nexit helps you find fitting countries, understand visa paths, build a realistic budget, and keep every moving task in one place.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="gold-button">Start your plan <ArrowRight size={17} /></Link>
              <a href="#how-it-works" className="inline-flex min-h-12 items-center rounded-xl border border-white/20 px-5 font-bold text-white hover:bg-white/5">See how it works</a>
            </div>
          </div>
          <div className="relative z-0 mx-auto w-full max-w-3xl lg:translate-x-10">
            <div className="absolute -inset-10 rounded-full bg-gold/10 blur-3xl" />
            <Image src="/images/hero-airplane-window.png" alt="Tropical coast seen through an airplane window" width={1672} height={941} priority className="relative h-auto w-full rounded-[2.5rem] object-cover shadow-2xl" />
            <Image src="/images/flight-path.png" alt="" width={1440} height={662} className="pointer-events-none absolute -bottom-12 -left-24 w-[72%] opacity-90" />
          </div>
        </div>

        <div id="features" className="absolute inset-x-0 bottom-0 z-20 mx-auto grid max-w-6xl translate-y-1/2 gap-px overflow-hidden rounded-card bg-line shadow-xl sm:grid-cols-3">
          {[
            [Sparkles, 'Find your best visa', 'Smart matching based on your profile'],
            [Calculator, 'Plan your budget', 'Understand realistic monthly costs'],
            [CheckCircle2, 'Move with confidence', 'A checklist that keeps you on track'],
          ].map(([Icon, title, copy]) => (
            <div key={String(title)} className="flex items-center gap-4 bg-white px-5 py-5 text-navy">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold-soft"><Icon size={20} /></span>
              <div><p className="text-sm font-extrabold">{String(title)}</p><p className="mt-0.5 text-xs text-muted">{String(copy)}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-6xl px-5 pb-20 pt-32 lg:px-8">
        <div className="text-center"><p className="text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">A path you can follow</p><h2 className="mt-3 font-display text-4xl font-bold text-navy">Your journey to freedom starts here</h2></div>
        <div id="destinations" className="mt-12 grid gap-6 md:grid-cols-3">
          {journey.map((item) => (
            <article key={item.title} className="card-surface overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden bg-canvas"><Image src={item.image} alt="" fill loading="eager" sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" /></div>
              <div className="p-6"><h3 className="text-xl font-extrabold text-navy">{item.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-muted">{item.copy}</p><Link href="/signup" className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-gold-deep">{item.action}<ArrowRight size={15} /></Link></div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 lg:px-8">
        <div className="grid overflow-hidden rounded-[22px] bg-navy-deep text-white md:grid-cols-[1fr_1.2fr]">
          <div className="p-8 sm:p-12"><Globe2 className="text-gold" size={32} /><blockquote className="mt-6 font-display text-2xl leading-relaxed">“Nexit gave me a clear plan and the confidence to finally make my move.”</blockquote><p className="mt-5 text-sm text-white/60">— Maya R., Bali, Indonesia</p></div>
          <div className="relative min-h-64"><Image src="/images/dashboard-beach-banner.png" alt="Sunlit tropical coast" fill loading="eager" sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/30 to-transparent" /></div>
        </div>
      </section>

      <section className="bg-navy py-10 text-white"><div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-5 text-center md:grid-cols-4 lg:px-8">{[['50+', 'Countries'], ['120+', 'Visa options'], ['20K+', 'Planners'], ['4.8/5', 'Average rating']].map(([value, label]) => <div key={label}><p className="text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm text-white/60">{label}</p></div>)}</div></section>

      <footer className="relative overflow-hidden bg-navy-deep text-white">
        <Image src="/images/footer-beach-ocean.png" alt="Golden beach and ocean at sunset" width={2172} height={724} loading="eager" className="h-72 w-full object-cover opacity-75" />
        <div className="absolute inset-0 flex items-center bg-gradient-to-r from-navy-deep via-navy-deep/65 to-transparent"><div className="mx-auto w-full max-w-6xl px-5 lg:px-8"><h2 className="max-w-xl font-display text-4xl font-bold">Your next adventure is waiting.</h2><p className="mt-3 text-white/75">Plan smart. Move with confidence. Live your freedom.</p><Link href="/signup" className="gold-button mt-6">Let&apos;s go <ArrowRight size={17} /></Link></div></div>
        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/55">© 2026 Nexit. Visa recommendations are planning guidance, not legal advice.</div>
      </footer>
    </main>
  )
}

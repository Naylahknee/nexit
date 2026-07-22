import Link from 'next/link'
import { ArrowRight, BookOpen, Globe2, Users } from 'lucide-react'

const actions = [
  { href: '/greenbook', title: 'Read Greenbook Insights', copy: 'Use practical prompts to research daily life and Community Fit.', icon: BookOpen },
  { href: '/nexitnation', title: 'Compare regions', copy: 'Open the Nexitnation map and narrow your strongest regional fit.', icon: Globe2 },
  { href: '/saved', title: 'Build your shortlist', copy: 'Save the Nextinations you want to keep comparing.', icon: Users },
]

export default function CommunityPage() {
  return (
    <div>
      <p className="text-sm font-bold text-teal-deep">Nexiters</p>
      <h1 className="mt-1 font-display text-4xl font-bold">Join our community of Nexiters.</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">Build a stronger Nexit Plan with context from people thinking seriously about relocation—not vacation content or unsupported safety promises.</p>
      <section className="mt-7 overflow-hidden rounded-[20px] bg-navy p-7 text-white sm:p-10">
        <Users size={34} className="text-gold" />
        <h2 className="mt-5 max-w-2xl font-display text-3xl font-bold">Make the decision with better questions and clearer context.</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">Verified member discussions are being developed. Until moderation and verification are ready, Nexit clearly labels editorial planning prompts and sourced insights.</p>
      </section>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {actions.map(({ href, title, copy, icon: Icon }) => (
          <Link key={href} href={href} className="card-surface group p-6 transition hover:-translate-y-0.5 hover:shadow-md">
            <span className="grid size-11 place-items-center rounded-xl bg-teal-soft text-teal-deep"><Icon size={20} /></span>
            <h2 className="mt-5 text-lg font-extrabold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-extrabold text-gold-deep">Open <ArrowRight size={15} /></span>
          </Link>
        ))}
      </div>
    </div>
  )
}

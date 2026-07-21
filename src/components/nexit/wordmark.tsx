import Link from 'next/link'

export function Wordmark({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Nexit home" className="inline-flex items-baseline font-extrabold leading-none">
      <span className={`${compact ? 'text-2xl' : 'text-3xl'} text-gold`}>N</span>
      <span className={`${compact ? 'text-xl' : 'text-2xl'} -ml-0.5 font-display font-extrabold italic ${dark ? 'text-white' : 'text-navy'}`}>
        exit
      </span>
    </Link>
  )
}

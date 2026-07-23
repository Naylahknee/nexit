import Image from 'next/image'
import Link from 'next/link'

export function Wordmark({ dark = false, compact = false, href = '/' }: { dark?: boolean; compact?: boolean; href?: string }) {
  const mark = compact ? 24 : 28
  return (
    <Link href={href} aria-label="Nexit home" className="inline-flex shrink-0 items-center gap-2">
      <Image src="/brand/nexit-butterfly.png" alt="" width={mark} height={mark} priority style={{ width: mark, height: mark }} className="h-auto" />
      <span className={`font-display font-bold leading-none ${dark ? 'text-white' : 'text-navy'}`} style={{ fontSize: compact ? 20 : 24 }}>
        <span className="text-gold">N</span>exit
      </span>
    </Link>
  )
}

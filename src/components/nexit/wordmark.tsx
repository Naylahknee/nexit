import Image from 'next/image'
import Link from 'next/link'

export function Wordmark({ dark = false, compact = false }: { dark?: boolean; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Nexit home" className="inline-flex shrink-0 items-center">
      <Image
        src={dark ? '/brand/nexit-wordmark-dark.png' : '/brand/nexit-wordmark-light.png'}
        alt=""
        width={121}
        height={34}
        className={compact ? 'h-auto w-[102px]' : 'h-auto w-[121px]'}
      />
    </Link>
  )
}

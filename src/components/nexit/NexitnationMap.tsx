import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { regionList, type RegionSlug } from '@/lib/nexitnation-data'

type MapProfile = { complete: boolean; matches: Record<RegionSlug, number> | null }

const shapes: Record<RegionSlug, string> = {
  'north-america': 'M55 92 L130 48 230 61 279 115 252 167 198 174 176 226 118 214 91 169 45 141Z',
  'latin-america': 'M201 232 L267 201 306 240 294 304 326 351 300 418 268 474 243 420 244 352 218 304Z',
  europe: 'M421 91 L487 68 552 94 546 139 511 162 458 151 413 125Z',
  africa: 'M434 173 L529 157 579 219 558 316 510 388 459 337 429 253Z',
  asia: 'M558 77 L704 45 877 78 940 144 880 204 792 196 734 232 647 192 565 145Z',
  oceania: 'M748 286 L829 259 917 302 944 372 893 428 805 413 769 365Z',
}

const imagePosition: Record<RegionSlug, { x: number; y: number; width: number; height: number }> = {
  'north-america': { x: 35, y: 35, width: 260, height: 210 },
  'latin-america': { x: 195, y: 190, width: 150, height: 300 },
  europe: { x: 405, y: 55, width: 160, height: 120 },
  africa: { x: 415, y: 145, width: 180, height: 255 },
  asia: { x: 545, y: 30, width: 410, height: 220 },
  oceania: { x: 730, y: 245, width: 230, height: 200 },
}

const labelPosition: Record<RegionSlug, [number, number]> = {
  'north-america': [155, 125], 'latin-america': [270, 325], europe: [482, 116], africa: [503, 252], asia: [755, 130], oceania: [850, 342],
}

export default function NexitnationMap({ profile }: { profile: MapProfile }) {
  return <section className="overflow-hidden rounded-[24px] border border-white/10 bg-navy-deep p-3 shadow-card sm:p-5" aria-label="Illustrated Nexitnation region map">
    <svg viewBox="0 0 1000 520" role="img" aria-labelledby="nexitnation-map-title nexitnation-map-desc" className="h-auto w-full">
      <desc id="nexitnation-map-desc">Six selectable world regions filled with relocation imagery.</desc>
      <defs>{regionList.map((region) => <clipPath id={`clip-${region.slug}`} key={region.slug}><path d={shapes[region.slug]} /></clipPath>)}</defs>
      <rect width="1000" height="520" rx="20" fill="#0D1B39" />
      <g opacity=".18" stroke="#F3C516" strokeWidth="1"><path d="M60 260 Q500 15 940 260" fill="none" /><path d="M60 300 Q500 505 940 300" fill="none" /></g>
      {regionList.map((region) => {
        const image = imagePosition[region.slug]
        const [x, y] = labelPosition[region.slug]
        const match = profile.matches?.[region.slug]
        return <Link href={`/nexitnation/${region.slug}`} key={region.slug} aria-label={`${region.name}, ${region.countryCount} countries`} className="nexit-region">
          <image href={region.image} {...image} preserveAspectRatio="xMidYMid slice" clipPath={`url(#clip-${region.slug})`} className="nexit-region-image" />
          <path d={shapes[region.slug]} fill="#0D1B39" fillOpacity=".48" stroke="#F3C516" strokeWidth="3" className="nexit-region-outline" />
          <text x={x} y={y} textAnchor="middle" fill="white" fontSize="18" fontWeight="800" className="pointer-events-none">{region.name}</text>
          <text x={x} y={y + 22} textAnchor="middle" fill="#D6DCE7" fontSize="11" className="pointer-events-none">{region.countryCount} countries</text>
          <text x={x} y={y + 40} textAnchor="middle" fill="#F3C516" fontSize="10" fontWeight="700" className="pointer-events-none">{profile.complete && match !== undefined ? `Nexit Match ${match}%` : 'Complete profile to see match'}</text>
        </Link>
      })}
    </svg>
    {!profile.complete ? <div className="m-2 flex flex-wrap items-center justify-between gap-4 rounded-card border border-gold/25 bg-white/8 p-5 text-white"><div><p className="font-bold">Complete your Nexit Profile to see personalized matches.</p><p className="mt-1 text-sm text-white/60">You can still open every region and research Nextinations now.</p></div><Link href="/profile-wizard" className="gold-button">Start Wizard <ArrowRight size={16} /></Link></div> : null}
  </section>
}

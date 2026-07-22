'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import mapboxgl, { type Map as MapboxMap } from 'mapbox-gl'
import { ArrowRight, KeyRound } from 'lucide-react'
import { regionList, type RegionConfig } from '@/lib/nexitnation-data'

export type NexitnationMapProfile = {
  budget: number
  remoteWorker: boolean
  household: string
}

function loadMapImage(map: MapboxMap, name: string, url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    map.loadImage(url, (error, image) => {
      if (error) {
        reject(error)
        return
      }

      if (!image) {
        reject(new Error(`Mapbox could not load ${url}`))
        return
      }

      if (!map.hasImage(name)) map.addImage(name, image, { pixelRatio: 2 })
      resolve()
    })
  })
}

function RegionGrid({ className = '' }: { className?: string }) {
  const router = useRouter()

  return (
    <div className={`grid gap-3 ${className}`}>
      {regionList.map((region) => (
        <button
          type="button"
          key={region.slug}
          onClick={() => router.push(`/nexitnation/${region.slug}`)}
          className="group relative min-h-36 overflow-hidden rounded-card border border-white/10 text-left"
        >
          <Image
            src={region.image}
            alt=""
            fill
            loading="eager"
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/72 to-transparent" />
          <span className="relative z-10 block p-5 text-white">
            <span className="font-display text-2xl font-bold">{region.name}</span>
            <span className="mt-1 block text-sm text-white/70">{region.countryCount} countries</span>
            <span className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
              {region.matchLabel} <ArrowRight size={14} />
            </span>
          </span>
        </button>
      ))}
    </div>
  )
}

export default function NexitnationMap({ profile }: { profile: NexitnationMapProfile }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const mapNode = useRef<HTMLDivElement | null>(null)
  const mapInstance = useRef<MapboxMap | null>(null)
  const routeTimer = useRef<number | null>(null)
  const router = useRouter()
  const [activeRegion, setActiveRegion] = useState<RegionConfig | null>(null)
  const [mapError, setMapError] = useState<string | null>(
    token ? null : 'The Mapbox public token is missing.',
  )

  useEffect(() => {
    if (!mapNode.current || mapInstance.current) return
    if (!token) return

    let mounted = true
    const map = new mapboxgl.Map({
      accessToken: token,
      container: mapNode.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [10, 18],
      zoom: 1.35,
      minZoom: 1.1,
      maxZoom: 6,
      projection: 'mercator',
      attributionControl: false,
    })

    mapInstance.current = map
    map.dragRotate.disable()
    map.touchZoomRotate.disableRotation()
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('load', async () => {
      try {
        map.addSource('nexit-regions', {
          type: 'geojson',
          data: '/data/continents.geojson',
          generateId: true,
        })

        await Promise.all(
          regionList.map((region) => loadMapImage(map, `region-pattern-${region.slug}`, region.image)),
        )

        if (!mounted) return

        regionList.forEach((region) => {
          const patternLayerId = `region-pattern-layer-${region.slug}`
          const tintLayerId = `region-tint-layer-${region.slug}`
          const glowLayerId = `region-glow-layer-${region.slug}`
          const outlineLayerId = `region-outline-layer-${region.slug}`
          const filter: mapboxgl.FilterSpecification = ['==', ['get', 'slug'], region.slug]

          map.addLayer({
            id: patternLayerId,
            type: 'fill',
            source: 'nexit-regions',
            filter,
            paint: { 'fill-pattern': `region-pattern-${region.slug}`, 'fill-opacity': 0.74 },
          })
          map.addLayer({
            id: tintLayerId,
            type: 'fill',
            source: 'nexit-regions',
            filter,
            paint: { 'fill-color': '#17305B', 'fill-opacity': 0.2 },
          })
          map.addLayer({
            id: glowLayerId,
            type: 'line',
            source: 'nexit-regions',
            filter,
            paint: {
              'line-color': '#F3C516',
              'line-width': 8,
              'line-opacity': 0.42,
              'line-blur': 8,
            },
          })
          map.addLayer({
            id: outlineLayerId,
            type: 'line',
            source: 'nexit-regions',
            filter,
            paint: { 'line-color': '#F3C516', 'line-width': 1.8, 'line-opacity': 0.95 },
          })

          map.on('mouseenter', patternLayerId, () => {
            map.getCanvas().style.cursor = 'pointer'
            map.setPaintProperty(patternLayerId, 'fill-opacity', 0.94)
            map.setPaintProperty(glowLayerId, 'line-opacity', 0.8)
            setActiveRegion(region)
          })
          map.on('mouseleave', patternLayerId, () => {
            map.getCanvas().style.cursor = ''
            map.setPaintProperty(patternLayerId, 'fill-opacity', 0.74)
            map.setPaintProperty(glowLayerId, 'line-opacity', 0.42)
          })
          map.on('click', patternLayerId, () => {
            map.flyTo({ center: region.center, zoom: region.zoom, speed: 0.9, curve: 1.2, essential: true })
            routeTimer.current = window.setTimeout(() => router.push(`/nexitnation/${region.slug}`), 550)
          })
        })
      } catch (error) {
        console.error('[nexitnation-map] initialization failed', error)
        if (mounted) {
          setMapError(error instanceof Error ? error.message : 'The Nexitnation map could not be loaded.')
        }
      }
    })

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message) && mounted) {
        setMapError('The Mapbox token was rejected. Check NEXT_PUBLIC_MAPBOX_TOKEN and redeploy.')
      }
    })

    return () => {
      mounted = false
      if (routeTimer.current !== null) window.clearTimeout(routeTimer.current)
      map.remove()
      mapInstance.current = null
    }
  }, [router, token])

  return (
    <section
      aria-labelledby="nexitnation-map-title"
      className="relative overflow-hidden rounded-card border border-white/10 bg-navy-deep shadow-card"
    >
      <div className="absolute left-5 top-5 z-20 hidden w-56 rounded-card border border-white/10 bg-navy-deep/90 p-4 text-white shadow-card backdrop-blur-md md:block">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-gold">Based on your Nexit Profile</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-white/65">Budget</dt><dd>${profile.budget.toLocaleString()}/mo</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-white/65">Work</dt><dd>{profile.remoteWorker ? 'Remote' : 'Local'}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-white/65">Household</dt><dd>{profile.household}</dd></div>
        </dl>
      </div>

      {activeRegion ? (
        <div className="absolute right-5 top-5 z-20 hidden w-64 rounded-card border border-gold/35 bg-navy-deep/95 p-4 text-white shadow-gold backdrop-blur-md md:block">
          <p className="font-display text-xl font-bold">{activeRegion.name}</p>
          <p className="mt-1 text-sm text-white/65">{activeRegion.countryCount} countries</p>
          <p className="mt-3 text-sm font-bold text-gold">{activeRegion.matchLabel}</p>
          <button
            type="button"
            onClick={() => router.push(`/nexitnation/${activeRegion.slug}`)}
            className="mt-4 w-full rounded-field bg-gold px-4 py-2 text-sm font-semibold text-navy transition hover:bg-gold-deep"
          >
            Explore This Nextination
          </button>
        </div>
      ) : null}

      {mapError ? (
        <div className="hidden min-h-[620px] p-6 md:block">
          <div className="mx-auto max-w-lg py-8 text-center text-white">
            <span className="mx-auto grid size-12 place-items-center rounded-xl bg-gold text-navy"><KeyRound size={22} /></span>
            <p className="mt-4 font-semibold">Map unavailable</p>
            <p className="mt-2 text-sm text-white/65">{mapError}</p>
          </div>
          <RegionGrid className="grid-cols-2 xl:grid-cols-3" />
        </div>
      ) : (
        <div ref={mapNode} className="hidden h-[min(72vh,720px)] min-h-[580px] w-full md:block" aria-label="Interactive map of Nexitnation regions" />
      )}

      <RegionGrid className="p-4 md:hidden" />
    </section>
  )
}

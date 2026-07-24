'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import mapboxgl from 'mapbox-gl'
import { ArrowRight, MapPinned } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'
import './nexitnation-map.css'
import { regionList, type RegionSlug } from '@/lib/nexitnation-data'

// Region centroids (lng, lat) for badge placement.
const REGION_CENTERS: Record<RegionSlug, [number, number]> = {
  europe: [14, 52],
  africa: [20, 4],
  asia: [95, 36],
  'north-america': [-100, 45],
  'latin-america': [-63, -12],
  oceania: [140, -25],
}

const GOLD = '#E5A93C'
const DIM = '#040B14'

type MapProfile = { complete: boolean; matches: Record<RegionSlug, number> | null }

export function NexitnationMapbox({ profile }: { profile: MapProfile }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    if (!token || mapError || !containerRef.current || mapRef.current) return

    const map = new mapboxgl.Map({
      accessToken: token,
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [12, 25],
      zoom: 1.35,
      minZoom: 1,
      maxZoom: 6,
      projection: 'mercator',
      attributionControl: false,
      cooperativeGestures: true,
    })
    mapRef.current = map
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
    map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')

    map.on('error', (event) => {
      const message = (event.error as Error | undefined)?.message ?? ''
      if (/access token|unauthorized|401/i.test(message)) setMapError(true)
    })

    map.on('style.load', () => {
      // Dark-earth dimmer: a world-covering fill above satellite, below markers.
      if (!map.getSource('nexit-dim')) {
        map.addSource('nexit-dim', {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [[[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]]] } },
        })
        map.addLayer({ id: 'nexit-dim', type: 'fill', source: 'nexit-dim', paint: { 'fill-color': DIM, 'fill-opacity': 0.55 } })
      }
      // Glowing gold country borders from the Mapbox Streets vector source.
      if (!map.getSource('nexit-admin')) {
        map.addSource('nexit-admin', { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v8' })
        map.addLayer({
          id: 'nexit-admin-glow', type: 'line', source: 'nexit-admin', 'source-layer': 'admin',
          filter: ['==', ['get', 'admin_level'], 0],
          paint: { 'line-color': GOLD, 'line-width': 2.2, 'line-blur': 3, 'line-opacity': 0.9 },
        })
        map.addLayer({
          id: 'nexit-admin-crisp', type: 'line', source: 'nexit-admin', 'source-layer': 'admin',
          filter: ['==', ['get', 'admin_level'], 0],
          paint: { 'line-color': GOLD, 'line-width': 0.6, 'line-opacity': 0.9 },
        })
      }
    })

    // Loop through region coordinates → custom HTML badge markers.
    const markers = regionList.map((region) => {
      const badge = document.createElement('button')
      badge.type = 'button'
      badge.className = 'custom-region-badge'
      badge.setAttribute('aria-label', `Explore ${region.name}: ${region.countryCount} countries`)

      const name = document.createElement('span')
      name.className = 'custom-region-badge__name'
      name.textContent = region.name

      const count = document.createElement('span')
      count.className = 'custom-region-badge__count'
      count.textContent = `${region.countryCount} countries`

      const match = document.createElement('span')
      match.className = 'custom-region-badge__match'
      const value = profile.matches?.[region.slug]
      match.textContent = profile.complete && value !== undefined ? `Nexit Match ${value}%` : 'Complete profile'

      badge.append(name, count, match)
      badge.addEventListener('click', () => router.push(`/nexitnation/${region.slug}`))

      return new mapboxgl.Marker({ element: badge, anchor: 'center' })
        .setLngLat(REGION_CENTERS[region.slug])
        .addTo(map)
    })

    return () => {
      markers.forEach((marker) => marker.remove())
      map.remove()
      mapRef.current = null
    }
  }, [token, mapError, profile, router])

  // Graceful fallback when no Mapbox token is configured — regions stay usable.
  if (!token || mapError) {
    return (
      <section className="hero-grid rounded-[24px] bg-navy-deep p-6 text-white sm:p-8" aria-label="Nexitnation regions">
        <div className="max-w-md">
          <span className="grid size-12 place-items-center rounded-xl bg-gold text-navy"><MapPinned size={22} /></span>
          <h2 className="mt-5 font-display text-2xl font-bold">Add your Mapbox token to unlock the live map.</h2>
          <p className="mt-2 text-sm text-white/65">Set <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> at build time. Every region still works below.</p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regionList.map((region) => {
            const value = profile.matches?.[region.slug]
            return (
              <button key={region.slug} type="button" onClick={() => router.push(`/nexitnation/${region.slug}`)} className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 p-4 text-left transition hover:border-gold hover:bg-white/12">
                <span><strong className="block text-sm">{region.name}</strong><span className="text-xs text-white/60">{region.countryCount} countries · {profile.complete && value !== undefined ? `Nexit Match ${value}%` : 'Complete profile'}</span></span>
                <ArrowRight size={16} className="text-gold" />
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  return (
    <div className="nexit-mapbox">
      <div ref={containerRef} className="absolute inset-0" aria-label="Interactive Mapbox map of Nexitnation regions" />
    </div>
  )
}

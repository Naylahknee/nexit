import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Nexit — Build your Nexit Plan',
    short_name: 'Nexit',
    description: 'Compare Nextinations, review Pathways, and build a practical Nexit Plan.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0D1B39',
    theme_color: '#F3C516',
    icons: [
      { src: '/brand/app-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/brand/app-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}

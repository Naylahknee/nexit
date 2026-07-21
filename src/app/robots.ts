import type { MetadataRoute } from 'next'
import { absoluteUrl, getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', '/onboarding', '/dashboard', '/nexitnation', '/visa-wizard',
        '/countries', '/checklist', '/cost-calculator', '/documents', '/settings',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  }
}

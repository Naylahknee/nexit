import type { MetadataRoute } from 'next'
import { absoluteUrl, getSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/', '/onboarding', '/welcome', '/profile-wizard', '/dashboard', '/nexitnation', '/pathways', '/visa-wizard',
        '/countries', '/nexit-plan', '/checklist', '/cost-calculator', '/greenbook', '/community', '/saved', '/documents', '/settings',
      ],
    },
    sitemap: absoluteUrl('/sitemap.xml'),
    host: getSiteUrl(),
  }
}

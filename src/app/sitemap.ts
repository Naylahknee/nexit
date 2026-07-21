import type { MetadataRoute } from 'next'
import { SEO_PAGES } from '@/lib/seoContent'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl('/'), lastModified: '2026-07-21', changeFrequency: 'monthly', priority: 1 },
    ...SEO_PAGES.map((page) => ({
      url: absoluteUrl(`/${page.slug}`),
      lastModified: page.lastReviewed,
      changeFrequency: 'monthly' as const,
      priority: page.kind === 'country' ? 0.9 : 0.8,
    })),
  ]
}

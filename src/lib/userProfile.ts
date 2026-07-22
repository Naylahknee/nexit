import 'server-only'

import { getProfile, hasCompletedProfile, type PathwayGoal, type RelocationProfile } from './profile'
import { REGION_SLUGS, type RegionSlug } from './nexitnation-data'

export type NexitnationUserProfile = {
  name: string
  regionMatches: Record<RegionSlug, number>
}

const labelToSlug: Record<string, RegionSlug> = {
  Europe: 'europe', Africa: 'africa', Asia: 'asia', Oceania: 'oceania',
  'North America': 'north-america', 'Latin America': 'latin-america',
}

const regionalSignals: Record<RegionSlug, PathwayGoal[]> = {
  europe: ['Remote Work', 'Employment', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Ancestry', 'Investment'],
  africa: ['Employment', 'Entrepreneurship', 'Education', 'Family Reunification', 'Ancestry', 'Investment'],
  asia: ['Remote Work', 'Employment', 'Entrepreneurship', 'Education', 'Investment'],
  'north-america': ['Employment', 'Entrepreneurship', 'Education', 'Family Reunification', 'Investment'],
  'latin-america': ['Remote Work', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Investment'],
  oceania: ['Employment', 'Entrepreneurship', 'Education', 'Family Reunification', 'Ancestry', 'Investment'],
}

export function calculateRegionMatches(profile: RelocationProfile): Record<RegionSlug, number> | null {
  if (!hasCompletedProfile(profile)) return null
  const selected = new Set(profile.preferred_regions.map((label) => labelToSlug[label]).filter(Boolean))
  const open = profile.preferred_regions.includes('Open to anywhere')
  return Object.fromEntries(REGION_SLUGS.map((slug) => {
    const preference = selected.has(slug) ? 35 : open ? 20 : 0
    const goalHits = profile.goals.filter((goal) => regionalSignals[slug].includes(goal)).length
    const goals = profile.goals.length ? Math.round(goalHits / profile.goals.length * 35) : 0
    const planningFacts = [profile.monthly_income !== null, profile.timeline !== null, profile.occupation !== null].filter(Boolean).length * 10
    return [slug, Math.min(100, preference + goals + planningFacts)]
  })) as Record<RegionSlug, number>
}

export function buildNexitnationProfile(profile: RelocationProfile, fallbackName: string): NexitnationUserProfile | null {
  const regionMatches = calculateRegionMatches(profile)
  if (!regionMatches) return null
  return { name: profile.display_name || fallbackName, regionMatches }
}

export async function loadNexitnationProfile(userId: number, email: string) {
  return buildNexitnationProfile(await getProfile(userId), email.split('@')[0])
}

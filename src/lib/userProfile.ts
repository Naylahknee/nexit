import 'server-only'

import { defaultProfile, getProfile, type RelocationProfile } from './profile'
import { REGIONS, type RegionSlug } from './regionData'

export type NexitnationUserProfile = {
  name: string
  monthlyIncome: number
  remote: boolean
  familySize: number
  priority: string
  climate: string
  preferredRegion: string
  readinessScore: number
  recommendedRegion: RegionSlug
  regionMatches: Record<RegionSlug, number>
}

const preferredRegionMap: Record<string, RegionSlug> = {
  Europe: 'europe',
  Americas: 'americas',
  'Asia-Pacific': 'asia-pacific',
}

function clampScore(score: number) {
  return Math.max(62, Math.min(98, Math.round(score)))
}

export function buildNexitnationProfile(profile: RelocationProfile, fallbackName: string): NexitnationUserProfile {
  const explicitPreference = preferredRegionMap[profile.preferred_region]
  const regionMatches = Object.fromEntries(REGIONS.map((region) => {
    const budgetFit = region.destinations.some((destination) => profile.monthly_income >= destination.monthlyBudget) ? 5 : -7
    const preferenceFit = explicitPreference === region.slug ? 7 : explicitPreference ? -2 : 2
    const remoteFit = profile.remote && region.destinations.some((destination) => /Digital|Nomad|Virtual|DE Rantau/i.test(destination.visaPath)) ? 3 : 0
    const climateFit = profile.climate === 'Warm' && region.slug !== 'europe' ? 2 : 0
    return [region.slug, clampScore(region.baseMatch + budgetFit + preferenceFit + remoteFit + climateFit)]
  })) as Record<RegionSlug, number>

  const recommendedRegion = explicitPreference ?? REGIONS.reduce((best, region) => (
    regionMatches[region.slug] > regionMatches[best] ? region.slug : best
  ), REGIONS[0].slug)

  const readinessScore = clampScore(
    58
      + (profile.onboarding_completed ? 12 : 0)
      + (profile.wizard_completed ? 18 : 0)
      + Math.min(profile.completed_tasks.length * 2, 8),
  )

  return {
    name: profile.display_name || fallbackName,
    monthlyIncome: profile.monthly_income,
    remote: profile.remote,
    familySize: profile.family_size,
    priority: profile.priority,
    climate: profile.climate,
    preferredRegion: profile.preferred_region,
    readinessScore,
    recommendedRegion,
    regionMatches,
  }
}

export async function loadNexitnationProfile(userId: number, email: string) {
  const fallbackName = email.split('@')[0]

  try {
    return buildNexitnationProfile(await getProfile(userId), fallbackName)
  } catch {
    return buildNexitnationProfile(defaultProfile(userId), fallbackName)
  }
}

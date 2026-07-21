import 'server-only'

import { getSql } from './db'

export type RelocationProfile = {
  user_id: number
  display_name: string
  current_country: string
  timeline: string
  priority: string
  monthly_income: number
  remote: boolean
  family_size: number
  preferred_region: string
  climate: string
  onboarding_completed: boolean
  wizard_completed: boolean
  completed_tasks: string[]
}

export function defaultProfile(userId: number): RelocationProfile {
  return {
    user_id: userId,
    display_name: '',
    current_country: '',
    timeline: 'Just exploring',
    priority: 'Affordability',
    monthly_income: 2500,
    remote: true,
    family_size: 1,
    preferred_region: 'Open to anywhere',
    climate: 'No preference',
    onboarding_completed: false,
    wizard_completed: false,
    completed_tasks: [],
  }
}

export async function getProfile(userId: number) {
  const rows = await getSql()`SELECT * FROM profiles WHERE user_id = ${userId} LIMIT 1` as RelocationProfile[]
  return rows[0] ?? defaultProfile(userId)
}

export async function saveProfile(profile: RelocationProfile) {
  const completedTasks = JSON.stringify(profile.completed_tasks)
  const rows = await getSql()`
    INSERT INTO profiles (
      user_id, display_name, current_country, timeline, priority, monthly_income,
      remote, family_size, preferred_region, climate, onboarding_completed,
      wizard_completed, completed_tasks, updated_at
    ) VALUES (
      ${profile.user_id}, ${profile.display_name}, ${profile.current_country}, ${profile.timeline},
      ${profile.priority}, ${profile.monthly_income}, ${profile.remote}, ${profile.family_size},
      ${profile.preferred_region}, ${profile.climate}, ${profile.onboarding_completed},
      ${profile.wizard_completed}, ${completedTasks}::jsonb, NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      current_country = EXCLUDED.current_country,
      timeline = EXCLUDED.timeline,
      priority = EXCLUDED.priority,
      monthly_income = EXCLUDED.monthly_income,
      remote = EXCLUDED.remote,
      family_size = EXCLUDED.family_size,
      preferred_region = EXCLUDED.preferred_region,
      climate = EXCLUDED.climate,
      onboarding_completed = EXCLUDED.onboarding_completed,
      wizard_completed = EXCLUDED.wizard_completed,
      completed_tasks = EXCLUDED.completed_tasks,
      updated_at = NOW()
    RETURNING *
  ` as RelocationProfile[]
  return rows[0]
}

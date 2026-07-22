import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
  mode: z.enum(['login', 'signup']).default('login'),
}).strict()

export const profileUpdateSchema = z.object({
  wizard_status: z.enum(['not_started', 'in_progress', 'completed', 'skipped']).optional(),
  display_name: z.string().trim().max(80).nullable().optional(),
  citizenship: z.string().trim().max(80).nullable().optional(),
  current_country: z.string().trim().max(80).nullable().optional(),
  monthly_income: z.number().int().min(0).max(1_000_000).nullable().optional(),
  annual_income: z.number().int().min(0).max(12_000_000).nullable().optional(),
  income_type: z.enum(['Employment', 'Self-employment', 'Pension', 'Investments', 'Mixed', 'Other']).nullable().optional(),
  remote: z.boolean().nullable().optional(),
  occupation: z.string().trim().max(120).nullable().optional(),
  credentials: z.string().trim().max(500).nullable().optional(),
  education: z.enum(['Secondary school', 'Associate degree', 'Bachelor’s degree', 'Master’s degree', 'Doctorate', 'Professional credential', 'Other']).nullable().optional(),
  savings: z.number().int().min(0).max(100_000_000).nullable().optional(),
  household_type: z.enum(['Solo', 'Couple', 'Family', 'Other']).nullable().optional(),
  family_size: z.number().int().min(1).max(12).nullable().optional(),
  spouse: z.boolean().nullable().optional(),
  dependents: z.number().int().min(0).max(19).nullable().optional(),
  ancestry_connections: z.string().trim().max(500).nullable().optional(),
  preferred_regions: z.array(z.enum(['North America', 'Latin America', 'Europe', 'Africa', 'Asia', 'Oceania', 'Open to anywhere'])).max(7).optional(),
  preferred_region: z.string().trim().max(80).nullable().optional(),
  timeline: z.enum(['0-3 months', '3-6 months', '6-12 months', '12+ months', 'Just researching']).nullable().optional(),
  priority: z.enum(['Affordability', 'Safety', 'Warm weather', 'Career options']).nullable().optional(),
  goals: z.array(z.enum(['Remote Work', 'Employment', 'Entrepreneurship', 'Passive Income / Retirement', 'Education', 'Family Reunification', 'Ancestry', 'Investment'])).max(8).optional(),
  climate: z.enum(['Warm', 'Four seasons', 'Cool', 'No preference']).nullable().optional(),
  onboarding_completed: z.boolean().optional(),
  wizard_completed: z.boolean().optional(),
  completed_tasks: z.array(z.string().max(80)).max(50).optional(),
  completed_at: z.string().datetime().nullable().optional(),
}).strict()

const nullableMoney = z.number().int().min(0).max(100_000_000).nullable()

export const nexitPlanUpdateSchema = z.object({
  saved_nextination: z.string().trim().max(100).nullable().optional(),
  selected_pathway: z.string().trim().max(180).nullable().optional(),
  target_move_date: z.string().date().nullable().optional(),
  household_members: z.number().int().min(1).max(20).nullable().optional(),
  timeline_stage: z.enum(['Explore', 'Decide', 'Prepare', 'Apply', 'Move', 'Settle']).optional(),
  checklist: z.array(z.string().trim().min(1).max(120)).max(100).optional(),
  budget: z.object({ housing: nullableMoney, food: nullableMoney, transport: nullableMoney, healthcare: nullableMoney, other: nullableMoney }).strict().optional(),
  documents: z.array(z.string().trim().min(1).max(120)).max(100).optional(),
  notes: z.string().max(10_000).nullable().optional(),
}).strict()

import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8).max(72),
  mode: z.enum(['login', 'signup']).default('login'),
}).strict()

export const profileUpdateSchema = z.object({
  display_name: z.string().trim().max(80).optional(),
  current_country: z.string().trim().max(80).optional(),
  timeline: z.enum(['0-3 months', '3-6 months', '6-12 months', 'Just exploring']).optional(),
  priority: z.enum(['Affordability', 'Safety', 'Warm weather', 'Career options']).optional(),
  monthly_income: z.number().int().min(0).max(1_000_000).optional(),
  remote: z.boolean().optional(),
  family_size: z.number().int().min(1).max(12).optional(),
  preferred_region: z.enum(['Europe', 'Americas', 'Asia-Pacific', 'Open to anywhere']).optional(),
  climate: z.enum(['Warm', 'Four seasons', 'Cool', 'No preference']).optional(),
  onboarding_completed: z.boolean().optional(),
  wizard_completed: z.boolean().optional(),
  completed_tasks: z.array(z.string().max(80)).max(50).optional(),
}).strict()

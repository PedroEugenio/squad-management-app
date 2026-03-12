import { z } from 'zod'

export const DRILL_LEVELS    = ['Beginner', 'Intermediate', 'Advanced', 'Elite'] as const
export const DRILL_CATEGORIES = ['Tactical', 'Technical', 'Physical', 'Warm-up', 'Goalkeeping'] as const
export const DRILL_OBJECTIVES = ['Passing', 'Shooting', 'Pressing', 'Transition', 'Recovery', 'Positioning'] as const
export const DRILL_EQUIPMENT  = ['Cones', 'Bibs', 'Small goals', 'Full-size goals', 'Balls', 'Poles'] as const
export const DRILL_SPACES     = ['Full pitch', 'Half pitch', '20x20 box', '30x20 box', 'Gym'] as const

export const drillSchema = z.object({
  title:         z.string().min(2, 'Title is required'),
  description:   z.string().min(10, 'Description is required'),
  category:      z.enum(DRILL_CATEGORIES),
  level:         z.enum(DRILL_LEVELS),
  durationMins:  z.number().int().min(1, 'Must be at least 1 minute').max(120),
  playersMin:    z.number().int().min(1, 'Required'),
  playersMax:    z.number().int().min(1, 'Required'),
  objectives:    z.array(z.enum(DRILL_OBJECTIVES)).min(1, 'Select at least one objective'),
  equipment:     z.array(z.enum(DRILL_EQUIPMENT)),
  space:         z.enum(DRILL_SPACES),
  coachingPoints: z.array(z.string().min(1)).min(1, 'Add at least one coaching point').max(5),
  imageUrl:      z.string().url('Must be a valid URL').optional().or(z.literal('')),
  youtubeId:     z.string().optional(),
  tags:          z.array(z.string()),
})

export type DrillFormValues = z.infer<typeof drillSchema>

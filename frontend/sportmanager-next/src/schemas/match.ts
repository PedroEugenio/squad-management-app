import { z } from 'zod'

const baseMatchSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Kick-off time is required'),
  competition: z.string().min(2, 'Competition is required'),
  opponent: z.string().min(2, 'Opponent is required'),
  venue: z.enum(['Home', 'Away', 'Neutral'] as const, { error: 'Select a venue' }),
  location: z.string().min(2, 'Stadium / location is required'),
  notes: z.string().max(500, 'Notes too long'),
  hasResult: z.boolean(),
})

const withResult = baseMatchSchema.extend({
  hasResult: z.literal(true),
  goalsFor: z.number().int().min(0, 'Cannot be negative'),
  goalsAgainst: z.number().int().min(0, 'Cannot be negative'),
  result: z.enum(['Win', 'Draw', 'Loss'] as const, { error: 'Select a result' }),
})

const withoutResult = baseMatchSchema.extend({
  hasResult: z.literal(false),
  goalsFor: z.null().optional(),
  goalsAgainst: z.null().optional(),
  result: z.literal('Upcoming').optional(),
})

export const matchSchema = z.discriminatedUnion('hasResult', [withResult, withoutResult])

export type MatchFormValues = z.infer<typeof matchSchema>

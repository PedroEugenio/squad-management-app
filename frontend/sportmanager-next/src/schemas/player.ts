import { z } from 'zod'
import { PLAYER_POSITIONS } from '@/lib/types'

export const playerSchema = z.object({
  number: z.number().int().min(1, 'Must be at least 1').max(99, 'Must be 99 or less'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  position: z.enum(PLAYER_POSITIONS, { error: 'Select a valid position' }),
  nationality: z.string().min(2, 'Nationality is required'),
  age: z.number().int().min(14, 'Must be at least 14').max(50, 'Must be 50 or less'),
  status: z.enum(['Fit', 'Injured', 'Suspended', 'Doubtful'] as const, { error: 'Select a valid status' }),
})

export type PlayerFormValues = z.infer<typeof playerSchema>

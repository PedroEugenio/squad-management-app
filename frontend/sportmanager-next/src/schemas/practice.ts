import { z } from 'zod'

export const practiceSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  type: z.enum(['Tactical', 'Physical', 'Technical', 'Recovery', 'Set Pieces'] as const, {
    error: 'Select a session type',
  }),
  duration: z.string().min(1, 'Duration is required (e.g. 90 min)'),
  location: z.string().min(2, 'Location is required'),
  attendance: z.number().int().min(0, 'Attendance cannot be negative').max(100, 'Attendance seems too high'),
  notes: z.string().max(500, 'Notes too long'),
})

export type PracticeFormValues = z.infer<typeof practiceSchema>

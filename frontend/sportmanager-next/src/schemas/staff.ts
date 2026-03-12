import { z } from 'zod'

export const staffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  role: z.string().min(2, 'Role is required'),
  status: z.enum(['Active', 'Inactive', 'Pending'] as const, { error: 'Select a valid status' }),
  phone: z.string(),
  joined: z.string(),
})

export type StaffFormValues = z.infer<typeof staffSchema>

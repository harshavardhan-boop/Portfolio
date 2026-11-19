import { z } from 'zod'

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80, 'Name is too long.'),
  email: z.string().trim().email('Please enter a valid email address.').max(254),
  message: z
    .string()
    .trim()
    .min(10, 'Message should be at least 10 characters.')
    .max(2000, 'Message should be under 2000 characters.'),
})

export type ContactInput = z.infer<typeof contactSchema>

export type ContactState = {
  status: 'idle' | 'success' | 'error'
  message?: string
  fieldErrors?: Partial<Record<keyof ContactInput, string>>
  values?: Partial<ContactInput>
}

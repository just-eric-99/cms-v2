import { z } from 'zod'

export const checkEmailSchema = z.object({
  email: z.string().email(),
})

export const inputPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  isRemember: z.boolean(),
})

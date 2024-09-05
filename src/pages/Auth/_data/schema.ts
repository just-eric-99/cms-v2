import { z } from 'zod'

export const checkEmailSchema = z.object({
  email: z.string().email(),
})

export const inputPasswordSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  isRemember: z.boolean(),
})

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

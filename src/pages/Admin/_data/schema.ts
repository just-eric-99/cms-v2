import { z } from 'zod'

export const createAdminSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  displayName: z.string(),
  email: z.string(),
  phone: z.string(),
  centerId: z.string(),
  roleId: z.string(),
})

export const updateAdminSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
  displayName: z.string(),
  email: z.string(),
  phone: z.string(),
  centerId: z.string(),
  roleId: z.string(),
})

import { z } from 'zod'

export const createOrganizationSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
})

export const updateOrganizationSchema = z.object({
  name: z.string(),
  nameEn: z.string(),
})

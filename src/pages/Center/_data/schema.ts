import { z } from 'zod'

export const createCenterSchema = z.object({
  name: z.string().min(1, '名字不能为空'),
  nameEn: z.string().min(1, '名字不能为空'),
  address: z.string().min(1),
  addressEn: z.string().min(1),
  organizationId: z.string().min(1),
})

export const updateCenterSchema = z.object({
  name: z.string().min(1, '名字不能为空'),
  nameEn: z.string().min(1, '名字不能为空'),
  address: z.string().min(1),
  addressEn: z.string().min(1),
  organizationId: z.string().min(1),
})

import { z } from 'zod'

export const createUserGroupSchema = z.object({
  name: z.string(),
  centerId: z.string(),
  userIds: z.array(z.object({ userId: z.string() })),
})

export const updateUserGroupSchema = z.object({
  name: z.string(),
  userIds: z.array(z.object({ userId: z.string() })),
})

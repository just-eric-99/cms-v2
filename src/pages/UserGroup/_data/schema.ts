import { z } from 'zod'

export const createUserGroupSchema = z.object({
  name: z.string(),
  centerId: z.string(),
  userIds: z.array(z.string()),
})

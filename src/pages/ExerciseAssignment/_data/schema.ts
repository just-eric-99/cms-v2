import { z } from 'zod'

export const createExerciseAssignmentSchema = z.object({
  userId: z.string(),
  userGroupId: z.string(),
  exercises: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      recurrence: z.number(),
      duration: z.number(),
    })
  ),
})

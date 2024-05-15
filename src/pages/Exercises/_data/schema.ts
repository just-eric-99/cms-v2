import { Permission } from '@/enum/permission'
import { z } from 'zod'

export const createExerciseSchema = z.object({
  centerId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.number().int().min(1).max(5),
  readyLandmark: z.object({
    normalizedLandmarks: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        visibility: z.number(),
      })
    ),
    worldLandmarks: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        visibility: z.number(),
      })
    ),
    jointDirectionsWeights: z.array(z.number()),
  }),
  startLandmark: z.object({
    normalizedLandmarks: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        visibility: z.number(),
      })
    ),
    worldLandmarks: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        visibility: z.number(),
      })
    ),
    jointDirectionsWeights: z.array(z.number()),
  }),
  permission: z.nativeEnum(Permission),
})

import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { z } from 'zod'

export const rotationObject = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  w: z.number(),
})

export const landmarkObject = z.object({
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
  jointDirectionsWeights: z
    .array(z.number())
    .refine((weights) => weights.reduce((a, b) => a + b, 0) >= 1, {
      message: 'Sum of weights must be greater than or equal to 1',
    }),
})

export const keyframeObject = z.object({
  timeframe: z.number(),
  keypoint: z.object({
    pelvisRot: rotationObject,
    spineRot: rotationObject,
    chestRot: rotationObject,
    leftShoulderRot: rotationObject,
    rightShoulderRot: rotationObject,
    leftElbowRot: rotationObject,
    rightElbowRot: rotationObject,
    leftHipRot: rotationObject,
    rightHipRot: rotationObject,
    leftKneeRot: rotationObject,
    rightKneeRot: rotationObject,
    leftAnkleRot: rotationObject,
    rightAnkleRot: rotationObject,
  }),
})

export const createExerciseSchema = z.object({
  organizationId: z.string().min(1),
  centerId: z.string().min(1),
  name: z.string().min(1),
  readyPoseDescription: z.string().min(1),
  startPoseDescription: z.string().min(1),
  readyPoseVoiceName: z.string().min(1).optional(),
  startPoseVoiceName: z.string().min(1).optional(),
  difficulty: z.number().int().min(1).max(10),
  readyLandmark: landmarkObject,
  startLandmark: landmarkObject,
  permission: z.nativeEnum(ExercisePermission),
  keyframes: z.array(keyframeObject),
})

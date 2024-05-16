import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { Landmark, NormalizedLandmark } from '@mediapipe/tasks-vision'

export type Exercise = {
  id: string
  centerId: string
  name: string
  description: string
  speechUrl: string
  createdByAdminId: string
  difficulty: number
  permission: ExercisePermission
  createdAt: string
  updatedAt: string
}

export type PoseLandmarkDto = {
  normalizedLandmarks: NormalizedLandmark[]
  worldLandmarks: Landmark[]
  jointDirectionsWeights: number[]
}

export type CreateExerciseRequest = {
  centerId: string
  name: string
  description: string
  difficulty: number
  readyLandmark: PoseLandmarkDto
  startLandmark: PoseLandmarkDto
  permission: ExercisePermission
}

export type UpdateExerciseRequest = {
  centerId?: string
  name?: string
  description?: string
  difficulty?: number
  startLandmark?: PoseLandmarkDto
  permission?: ExercisePermission
}

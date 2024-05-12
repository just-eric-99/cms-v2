import { Permission } from '@/enum/permission'
import { NormalizedLandmark } from '@mediapipe/tasks-vision'

export type Exercise = {
  id: string
  centerId: string
  name: string
  description: string
  speechUrl: string
  createdByAdminId: string
  difficulty: number
  permission: Permission
  createdAt: string
  updatedAt: string
}

export type PoseLandmarkDto = {
  landmarks: NormalizedLandmark[][]
  jointDirectionsWeights: number[]
}

export type CreateExerciseRequest = {
  centerId: string
  name: string
  description: string
  speechUrl: string
  difficulty: number
  startLandmark: PoseLandmarkDto
  permission: Permission
}

export type UpdateExerciseRequest = {
  centerId?: string
  name?: string
  description?: string
  speechUrl?: string
  difficulty?: number
  startLandmark?: PoseLandmarkDto
  permission?: Permission
}

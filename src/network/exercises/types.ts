import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { Landmark, NormalizedLandmark } from '@mediapipe/tasks-vision'
import { Center } from '@/network/centers/types.ts'

export type Exercise = {
  id: string
  centerId: string
  name: string
  description: string
  difficulty: number
  permission: ExercisePermission
  createdAt: string
  updatedAt: string
}

export type ExerciseDetails = {
  id: string
  centerId: string
  name: string
  description: string
  difficulty: number
  permission: ExercisePermission
  createdAt: string
  updatedAt: string
  center: Center
  readyPose: PoseLandmarkDto
  startPose: PoseLandmarkDto
  voiceFilename: string
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
  voiceFilename: string
}

export type UpdateExerciseRequest = {
  centerId: string
  name: string
  description: string
  difficulty: number
  readyLandmark: PoseLandmarkDto
  startLandmark: PoseLandmarkDto
  permission: ExercisePermission
  voiceFilename?: string
}

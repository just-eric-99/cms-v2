import { ExercisePermission } from '@/enum/exercisePermission.ts'
import { Landmark, NormalizedLandmark } from '@mediapipe/tasks-vision'
import { Center } from '@/network/centers/types.ts'

export type Exercise = {
  id: string
  centerId: string
  name: string
  readyPoseDescription: string
  startPoseDescription: string
  readyPoseVoiceName: string
  startPoseVoiceName: string
  difficulty: number
  permission: ExercisePermission
  createdAt: string
  updatedAt: string
}

export type ExerciseDetails = {
  id: string
  centerId: string
  name: string
  readyPoseDescription: string
  startPoseDescription: string
  readyPoseVoiceName: string
  startPoseVoiceName: string
  difficulty: number
  permission: ExercisePermission
  createdAt: string
  updatedAt: string
  center: Center
  readyPose: PoseLandmarkDto
  startPose: PoseLandmarkDto
  keyframes: Keyframe[]
}

export type PoseLandmarkDto = {
  normalizedLandmarks: NormalizedLandmark[]
  worldLandmarks: Landmark[]
  jointDirectionsWeights: number[]
}

export type CreateExerciseRequest = {
  centerId: string
  name: string
  readyPoseDescription: string
  startPoseDescription: string
  readyPoseVoiceName?: string | undefined
  startPoseVoiceName?: string | undefined
  difficulty: number
  readyLandmark: PoseLandmarkDto
  startLandmark: PoseLandmarkDto
  permission: ExercisePermission
  keyframes: Keyframe[]
}

export type UpdateExerciseRequest = {
  centerId: string
  name: string
  readyPoseDescription: string
  startPoseDescription: string
  readyPoseVoiceName?: string | undefined
  startPoseVoiceName?: string | undefined
  difficulty: number
  readyLandmark: PoseLandmarkDto
  startLandmark: PoseLandmarkDto
  permission: ExercisePermission
  voiceFilename?: string
  keyframes?: Keyframe[] | null
}

export type KeypointCoordinates = {
  x: number
  y: number
  z: number
  w: number
}

export type Keyframe = {
  timeframe: number
  keypoint: {
    pelvisRot: KeypointCoordinates
    spineRot: KeypointCoordinates
    chestRot: KeypointCoordinates
    leftShoulderRot: KeypointCoordinates
    rightShoulderRot: KeypointCoordinates
    leftElbowRot: KeypointCoordinates
    rightElbowRot: KeypointCoordinates
    leftHipRot: KeypointCoordinates
    rightHipRot: KeypointCoordinates
    leftKneeRot: KeypointCoordinates
    rightKneeRot: KeypointCoordinates
    leftAnkleRot: KeypointCoordinates
    rightAnkleRot: KeypointCoordinates
  }
}

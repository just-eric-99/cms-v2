import { Exercise } from '@/network/exercises/types.ts'

export type Record = {
  id: string
  userId: string
  startAt: string
  finishAt: string
  score: number
  userExerciseSetId: string
  createdAt: string
  updatedAt: string
  user: UserExerciseUser
  userExerciseSet: UserExerciseSet

  userName: string | null
  // exerciseName: string | null
}

export type RecordDetails = Record & {
  userExerciseRecord: UserExerciseRecord[]
}

export type UserExerciseUser = {
  id: string
  userGroupId: string
  centerId: string
  createdAt: string
  updatedAt: string
}

export type UserExerciseSet = {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type UserExerciseRecord = {
  id: string
  exerciseId: string
  userExerciseId: string
  createdAt: string
  updatedAt: string
  exercise: Exercise
}

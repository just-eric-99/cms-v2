import { Exercise } from '@/network/exercises/types.ts'

export type AssignExerciseToUser = {
  userId: string
  exercises: ExerciseAssignment[]
}

export type AssignExerciseToUserRequest = {
  userId: string
  exercises: ExerciseAssignmentRequest[]
}

export type AssignExerciseToUserGroup = {
  userGroupId: string
  exercises: ExerciseAssignment[]
}

export type AssignExerciseToUserGroupRequest = {
  userGroupId: string
  exercises: ExerciseAssignmentRequest[]
}

export type ExerciseAssignment = {
  id: string
  name: string
  recurrence: number
  duration: number
}

export type ExerciseAssignmentRequest = {
  exerciseId: string
  recurrence: number
  duration: number
}

export type ExerciseAssignmentDetails = {
  id: string
  userId: string
  exerciseId: string
  recurrence: number
  duration: number
  order: number
  createdAt: string
  updatedAt: string
  exercise: Exercise
}

import { API_ENDPOINT } from '@/constants/network.ts'
import {
  AssignExerciseToUser,
  AssignExerciseToUserGroup,
  AssignExerciseToUserGroupRequest,
  AssignExerciseToUserRequest,
  ExerciseAssignmentDetails,
} from '@/network/exercise-assignment/types.ts'

export async function assignExerciseToUser(assignment: AssignExerciseToUser) {
  const request: AssignExerciseToUserRequest = {
    userId: assignment.userId,
    exercises: assignment.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      recurrence: exercise.recurrence,
      duration: exercise.duration,
    })),
  }
  const response = await fetch(API_ENDPOINT + '/exercise-assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to assign exercise to user')
  }
}

export async function assignExerciseToUserGroup(
  assignment: AssignExerciseToUserGroup
) {
  const request: AssignExerciseToUserGroupRequest = {
    userGroupId: assignment.userGroupId,
    exercises: assignment.exercises.map((exercise) => ({
      exerciseId: exercise.id,
      recurrence: exercise.recurrence,
      duration: exercise.duration,
    })),
  }
  const response = await fetch(API_ENDPOINT + '/exercise-assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error('Failed to assign exercise to user')
  }
}

export async function getExerciseAssignmentsByUserId(
  userId: string
): Promise<ExerciseAssignmentDetails[]> {
  const response = await fetch(API_ENDPOINT + `/exercise-assignment/${userId}`)
  return response.json()
}

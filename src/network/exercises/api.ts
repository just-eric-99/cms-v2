import { API_ENDPOINT } from '@/constants/network'
import {
  CreateExerciseRequest,
  Exercise,
  ExerciseDetails,
  UpdateExerciseRequest,
} from './types'

// import { toast } from 'sonner'

export async function getAllExercises(): Promise<Exercise[]> {
  const response = await fetch(API_ENDPOINT + '/exercise')
  return response.json()
}

export async function getExerciseById(id: string): Promise<ExerciseDetails> {
  const response = await fetch(API_ENDPOINT + `/exercise/${id}`)
  return response.json()
}

export async function createExercise(
  exercise: CreateExerciseRequest
): Promise<void> {
  const response = await fetch(API_ENDPOINT + '/exercise', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exercise),
  })

  if (!response.ok) {
    // toast('Error', {
    //   description: (response.body? ).join('\n'),
    // })
    throw new Error('Failed to create exercise')
  }
}

export async function editExercise(
  exercise: UpdateExerciseRequest,
  id: string
) {
  const response = await fetch(API_ENDPOINT + `/exercise/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(exercise),
  })

  if (!response.ok) {
    throw new Error('Failed to edit exercise')
  }
}

export async function deleteExercise(exerciseId: string) {
  const response = await fetch(API_ENDPOINT + `/exercise/${exerciseId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete exercise')
  }
}

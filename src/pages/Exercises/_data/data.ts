import { createExercise, getAllExercises } from '@/network/exercises/api'
import { ExerciseColumnDef } from '../_table/columns'
import { createExerciseSchema } from './schema'
import { z } from 'zod'
import { CreateExerciseRequest } from '@/network/exercises/types'

export async function getExercisesTableData(): Promise<ExerciseColumnDef[]> {
  const exercises = await getAllExercises()
  const exercisesTableData: ExerciseColumnDef[] = exercises.map((exercise) => ({
    id: exercise.id,
    centerId: exercise.centerId,
    name: exercise.name,
    createdByAdminId: exercise.createdByAdminId,
    difficulty: exercise.difficulty,
    permission: exercise.permission,
  }))
  return exercisesTableData
}

export async function addNewExercise(
  exerciseSchema: z.infer<typeof createExerciseSchema>
) {
  const exercise: CreateExerciseRequest = {
    centerId: exerciseSchema.centerId,
    name: exerciseSchema.name,
    description: exerciseSchema.description,
    difficulty: exerciseSchema.difficulty,
    readyLandmark: exerciseSchema.readyLandmark,
    startLandmark: exerciseSchema.startLandmark,
    permission: exerciseSchema.permission,
  }

  await createExercise(exercise)
}

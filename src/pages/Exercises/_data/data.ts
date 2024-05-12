import { getAllExercises } from '@/network/exercises/api'
import { ExerciseColumnDef } from '../_table/columns'

export async function getExercisesTableData(): Promise<ExerciseColumnDef[]> {
  const exercises = await getAllExercises()
  const exercisesTableData: ExerciseColumnDef[] = exercises.map((exercise) => ({
    centerId: exercise.centerId,
    name: exercise.name,
    createdByAdminId: exercise.createdByAdminId,
    difficulty: exercise.difficulty,
    permission: exercise.permission,
  }))
  return exercisesTableData
}

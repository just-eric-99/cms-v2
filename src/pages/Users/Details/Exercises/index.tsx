import { DataTable } from '@/components/table/data-table.tsx'
import { useQuery } from '@tanstack/react-query'
import { getExerciseAssignmentsByUserId } from '@/network/exercise-assignment/api.ts'
import { columns } from '@/pages/Users/Details/Exercises/_table/columns.tsx'
import Loader from '@/components/loader.tsx'
import { useEffect } from 'react'
import ExerciseAssignmentPage from '@/pages/ExerciseAssignment'
// import { Exercise } from '@/network/exercises/types.ts'

type UserDetailsExercisesPageProps = {
  userId: string
}

export default function UserDetailsExercisesPage(
  props: UserDetailsExercisesPageProps
) {
  useEffect(() => {
    console.log('UserDetailsExercisesPage', props.userId)
  })

  const query = useQuery({
    queryKey: ['assigned-exercises'],
    queryFn: async () => {
      return await getExerciseAssignmentsByUserId(props.userId)
    },
  })
  if (query.isLoading) return <Loader />

  return (
    <DataTable
      columns={columns}
      data={
        query.data?.map((exercise) => {
          return {
            id: exercise.exerciseId,
            name: exercise.exercise.name,
            duration: exercise.duration,
            recurrence: exercise.recurrence,
          }
        }) ?? []
      }
      navigationPath={'/exercises'}
      createComponent={
        <ExerciseAssignmentPage
          type={'user'}
          userId={props.userId}
          assignedExercises={
            query.data?.map((exercise) => ({
              id: exercise.exerciseId,
              name: exercise.exercise.name,
              duration: exercise.duration,
              recurrence: exercise.recurrence,
            })) ?? []
          }
        />
      }
    />
  )
}

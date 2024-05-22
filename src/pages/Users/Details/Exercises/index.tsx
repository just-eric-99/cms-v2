import { DataTable } from '@/components/table/data-table.tsx'
import { useQuery } from '@tanstack/react-query'
import { getExerciseAssignmentsByUserId } from '@/network/exercise-assignment/api.ts'
import { columns } from '@/pages/Users/Details/Exercises/_table/columns.tsx'
import Loader from '@/components/loader.tsx'
import { useEffect } from 'react'
import ExerciseAssignmentPage from '@/pages/ExerciseAssignment'

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
      const assignedExercises = await getExerciseAssignmentsByUserId(
        props.userId
      )
      console.log(assignedExercises)
      return assignedExercises
    },
  })
  if (query.isLoading) return <Loader />

  return (
    <DataTable
      columns={columns}
      data={query.data ?? []}
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

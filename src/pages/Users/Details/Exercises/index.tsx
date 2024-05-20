import { DataTable } from '@/components/table/data-table.tsx'
import { useQuery } from '@tanstack/react-query'
import { getExerciseAssignmentsByUserId } from '@/network/exercise-assignment/api.ts'
import { columns } from '@/pages/Users/Details/Exercises/_table/columns.tsx'
// import ExerciseAssignmentPage from '@/pages/ExerciseAssignment'
// import { useState } from 'react'
// import { ExerciseAssignment } from '@/network/exercise-assignment/types.ts'
import Loader from '@/components/loader.tsx'
import {useEffect} from "react";

type UserDetailsExercisesPageProps = {
  userId: string
}

export default function UserDetailsExercisesPage(
  props: UserDetailsExercisesPageProps
) {
  // const [assignedExercises, setAssignedExercises] = useState<
  //   ExerciseAssignment[]
  // >([])

  useEffect(()=> {
    console.log('UserDetailsExercisesPage', props.userId)

  })

  const query = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const exercisesAssignmentDetails = await getExerciseAssignmentsByUserId(
        props.userId
      )

      // const assignedExercises: ExerciseAssignment[] =
      //   exercisesAssignmentDetails.map((exercise) => {
      //     return {
      //       id: exercise.id,
      //       name: exercise.exercise.name,
      //       recurrence: exercise.recurrence,
      //       duration: exercise.duration,
      //     }
      //   })

      // setAssignedExercises(assignedExercises)

      return exercisesAssignmentDetails
    },
  })
  if (query.isLoading) return <Loader />

  return (
    <DataTable
      columns={columns}
      data={query.data ?? []}
      navigationPath={'/exercises'}
      createComponent={
        // <ExerciseAssignmentPage
        //   type={'user'}
        //   assignedExercises={assignedExercises}
        // />
        <></>
      }
    />
  )
}

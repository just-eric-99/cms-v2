import { ColumnDef } from '@tanstack/react-table'
import { ExerciseAssignmentDetails } from '@/network/exercise-assignment/types.ts'

export const columns: ColumnDef<ExerciseAssignmentDetails>[] = [
  {
    accessorKey: 'id',
    header: () => <div className='pl-2 text-left'>ID</div>,
    cell: ({ row }) => {
      const name = row.getValue('id') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  // {
  //   // accessorKey: 'exercise.name',
  //   id: 'exercise.name',
  //   header: () => <div className='pl-2 text-left'>Name</div>,
  //   cell: ({ row }) => {
  //     const name = row.original.exercise.name
  //     return <div className='pl-2 text-left font-medium'>{name}</div>
  //   },
  // },
  // {
  //   accessorKey: 'center',
  //   header: () => <div className='pl-2 text-left'>Center</div>,
  //   cell: ({ row }) => {
  //     const centerId = row.original.exercise.centerId
  //     // const centerId = row.getValue('centerId') as string
  //     return <div className='pl-2 text-left font-medium'>{centerId}</div>
  //   },
  // },
  // {
  //   accessorKey: 'difficulty',
  //   header: () => <div className='pl-2 text-left'>Difficulty</div>,
  //   cell: ({ row }) => {
  //     console.log(row.original.exercise.difficulty)
  //     const difficulty = row.original.exercise.difficulty
  //     return <div className='pl-2 text-left font-medium'>{difficulty}</div>
  //   },
  // },
  {
    accessorKey: 'duration',
    header: () => <div className='pl-2 text-left'>Duration</div>,
    cell: ({ row }) => {
      const duration = row.getValue('duration') as string
      return <div className='pl-2 text-left font-medium'>{duration}</div>
    },
  },
  {
    accessorKey: 'recurrence',
    header: () => <div className='pl-2 text-left'>Recurrence</div>,
    cell: ({ row }) => {
      const recurrence = row.getValue('recurrence') as string
      return <div className='pl-2 text-left font-medium'>{recurrence}</div>
    },
  },
]

import { ColumnDef } from '@tanstack/react-table'
// import { ExerciseAssignmentDetails } from '@/network/exercise-assignment/types.ts'
// import {Exercise} from "@/network/exercises/types.ts";
import {ExerciseAssignment} from "@/network/exercise-assignment/types.ts";
export const columns: ColumnDef<ExerciseAssignment>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='pl-2 text-left'>Name</div>,
    cell: ({ row }) => {
      const name = row.original.name
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
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

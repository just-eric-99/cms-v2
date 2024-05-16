import { ColumnDef } from '@tanstack/react-table'
import { Exercise } from '@/network/exercises/types.ts'

export const columns: ColumnDef<Exercise>[] = [
  {
    accessorKey: 'id',
    header: () => <div className='pl-2 text-left'>ID</div>,
    cell: ({ row }) => {
      const name = row.getValue('id') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'name',
    header: () => <div className='pl-2 text-left'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'centerId',
    header: () => <div className='pl-2 text-left'>Center Id</div>,
    cell: ({ row }) => {
      const centerId = row.getValue('centerId') as string
      return <div className='pl-2 text-left font-medium'>{centerId}</div>
    },
  },
  {
    accessorKey: 'difficulty',
    header: () => <div className='pl-2 text-left'>Difficulty</div>,
    cell: ({ row }) => {
      const difficulty = row.getValue('difficulty') as string
      return <div className='pl-2 text-left font-medium'>{difficulty}</div>
    },
  },
]

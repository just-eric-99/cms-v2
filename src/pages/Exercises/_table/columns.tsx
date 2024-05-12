import { Permission } from '@/enum/permission'
import { ColumnDef } from '@tanstack/react-table'

export type ExerciseColumnDef = {
  centerId: string
  name: string
  createdByAdminId: string
  difficulty: number
  permission: Permission
}

export const columns: ColumnDef<ExerciseColumnDef>[] = [
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

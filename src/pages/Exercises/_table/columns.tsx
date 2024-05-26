import { ColumnDef } from '@tanstack/react-table'

export type ExerciseColumn = {
  name: string
  organization: string
  center: string
  difficulty:  number
  permission: string
}

export const columns: ColumnDef<ExerciseColumn>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='pl-2 text-left'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'organization',
    header: () => <div className='pl-2 text-left'>Organization</div>,
    cell: ({ row }) => {
      const organization = row.getValue('organization') as string
      return <div className='pl-2 text-left font-medium'>{organization}</div>
    },
  },
  {
    accessorKey: 'center',
    header: () => <div className='pl-2 text-left'>Center</div>,
    cell: ({ row }) => {
      const centerId = row.getValue('center') as string
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
  {
    accessorKey: 'permission',
    header: () => <div className='pl-2 text-left'>Permission</div>,
    cell: ({ row }) => {
      const permission = row.getValue('permission') as string
      return <div className='pl-2 text-left font-medium'>{permission}</div>
    },
  },
]

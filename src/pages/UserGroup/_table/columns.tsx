import { ColumnDef } from '@tanstack/react-table'
import { UserGroup } from '@/network/user-groups/types.ts'

export const columns: ColumnDef<UserGroup>[] = [
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
]

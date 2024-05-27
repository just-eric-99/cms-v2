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
    accessorKey: 'organization',
    header: () => <div className='pl-2 text-left'>Organisation</div>,
    cell: ({ row }) => {
      const org = row.original.center.organization.name
      return <div className='pl-2 text-left font-medium'>{org}</div>
    },
  },
  {
    accessorKey: 'center',
    header: () => <div className='pl-2 text-left'>Center</div>,
    cell: ({ row }) => {
      const center = row.original.center.name
      return <div className='pl-2 text-left font-medium'>{center}</div>
    },
  },
]

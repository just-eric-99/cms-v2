import { ColumnDef } from '@tanstack/react-table'
import { UserGroup } from '@/network/user-groups/types.ts'

export const columns: ColumnDef<UserGroup>[] = [
  {
    accessorKey: 'id',
    header: () => <div className='pl-2 text-left'>ID</div>,
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return <div className='pl-2 text-left font-medium'>{id}</div>
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
    accessorKey: 'createdAt',
    header: () => <div className='pl-2 text-left'>Created At</div>,
    cell: ({ row }) => {
      const createdAt = row.getValue('createdAt') as string
      return <div className='pl-2 text-left font-medium'>{createdAt}</div>
    },
  },
  {
    accessorKey: 'updatedAt',
    header: () => <div className='pl-2 text-left'>Updated At</div>,
    cell: ({ row }) => {
      const updatedAt = row.getValue('updatedAt') as string
      return <div className='pl-2 text-left font-medium'>{updatedAt}</div>
    },
  },
]

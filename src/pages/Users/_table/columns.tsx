import { Button } from '@/components/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown } from 'lucide-react'
import { UserSummaryType } from '../_data/types'

export const columns: ColumnDef<UserSummaryType>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='pl-2 text-left'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'centerId',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Center Id
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
  {
    accessorKey: 'organizationId',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Organization Id
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
  },
]

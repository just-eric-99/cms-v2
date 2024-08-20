import { ColumnDef } from '@tanstack/react-table'
import { Record } from '@/network/records/types'
import { Button } from '@/components/ui/button.tsx'
import { ArrowUpDown } from 'lucide-react'
import { format } from 'date-fns'

export const columns: ColumnDef<Record>[] = [
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <Button
  //       variant={'ghost'}
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //     >
  //       ID
  //       <ArrowUpDown className='ml-2 h-4 w-4' />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const id = row.getValue('id') as string
  //     return <div className='pl-2 text-left font-medium'>{id}</div>
  //   },
  // },
  {
    accessorKey: 'userExerciseSetId',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        User Exercise Set ID
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const userExerciseSetId = row.getValue('userExerciseSetId') as string
      return (
        <div className='pl-2 text-left font-medium'>{userExerciseSetId}</div>
      )
    },
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Username
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const userName = row.getValue('userName') as string
      return <div className='pl-2 text-left font-medium'>{userName}</div>
    },
  },
  {
    accessorKey: 'startAt',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Start At
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const isoDateString = row.getValue('startAt') as string
      const startAt = format(new Date(isoDateString), 'yyyy-MM-dd HH:mm:ss')
      return <div className='pl-2 text-left font-medium'>{startAt}</div>
    },
  },
  {
    accessorKey: 'finishAt',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Finished At
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const isoDateString = row.getValue('finishAt') as string
      const finishAt = format(new Date(isoDateString), 'yyyy-MM-dd HH:mm:ss')
      return <div className='pl-2 text-left font-medium'>{finishAt}</div>
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <Button
        variant={'ghost'}
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Created At
        <ArrowUpDown className='ml-2 h-4 w-4' />
      </Button>
    ),
    cell: ({ row }) => {
      const isoDateString = row.getValue('createdAt') as string
      const createdAt = format(new Date(isoDateString), 'yyyy-MM-dd HH:mm:ss')
      return <div className='pl-2 text-left font-medium'>{createdAt}</div>
    },
  },
]

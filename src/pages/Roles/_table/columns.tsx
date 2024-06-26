import { ColumnDef } from '@tanstack/react-table'
import { Role } from '@/network/roles/types.ts'
import { ArrowUpDown, CircleCheck, CircleX } from 'lucide-react'
import { Button } from '@/components/ui/button.tsx'

export const columns: ColumnDef<Role>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title (Chinese)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const title = row.getValue('title') as string
      return <div className='pl-2 text-left font-medium'>{title}</div>
    },
  },
  {
    accessorKey: 'titleEn',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title (English)
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      )
    },
    cell: ({ row }) => {
      const titleEn = row.getValue('titleEn') as string
      return <div className='pl-2 text-left font-medium'>{titleEn}</div>
    },
  },
  {
    accessorKey: 'center',
    header: () => <div className='pl-2 text-left'>Center</div>,
    cell: ({ row }) => {
      const name = row.original.center?.name
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'organization',
    header: () => <div className='pl-2 text-left'>Organisation</div>,
    cell: ({ row }) => {
      const name = row.original.organization?.name
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'super',
    header: () => <div className='pl-2 text-left'>Super</div>,
    cell: ({ row }) => {
      const superRole = row.getValue('super') as boolean
      return (
        <div className='pl-2 text-left font-medium'>
          {superRole ? <CircleCheck /> : <CircleX />}
        </div>
      )
    },
  },
]

import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { Center } from '@/network/centers/types.ts'

export const columns: ColumnDef<Center>[] = [
  {
    accessorKey: 'id',
    header: () => <div className="pl-2 text-left">ID</div>,
    cell: ({ row }) => {
      const id = row.getValue('id') as string
      return <div className="pl-2 text-left font-medium">{id}</div>
    },
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          名字
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className="pl-2 text-left font-medium">{name}</div>
    },
  },
  {
    accessorKey: 'nameEn',
    header: ({ column }) => {
      return (
        <Button
          variant={'ghost'}
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const name = row.getValue('nameEn') as string
      return <div className="pl-2 text-left font-medium">{name}</div>
    },
  },
  {
    accessorKey: 'address',
    header: () => <div className="pl-2 text-left">地址</div>,
    cell: ({ row }) => {
      const name = row.getValue('address') as string
      return <div className="pl-2 text-left font-medium">{name}</div>
    },
  },
  {
    accessorKey: 'addressEn',
    header: () => <div className="pl-2 text-left">Address</div>,
    cell: ({ row }) => {
      const name = row.getValue('addressEn') as string
      return <div className="pl-2 text-left font-medium">{name}</div>
    },
  },
  {
    accessorKey: 'organization',
    header: () => <div className="pl-2 text-left">組織</div>,
    cell: ({ row }) => {
      const name = row.original.organization.name
      return <div className="pl-2 text-left font-medium">{name}</div>
    },
  },
  {
    accessorKey: 'organizationEn',
    header: () => <div className="pl-2 text-left">Organization</div>,
    cell: ({ row }) => {
      const name = row.original.organization.nameEn
      return <div className="pl-2 text-left font-medium">{name}</div>
    },
  },
]

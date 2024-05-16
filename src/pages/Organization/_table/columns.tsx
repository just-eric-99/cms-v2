import { ColumnDef } from '@tanstack/react-table'
import {Organization} from "@/network/organization/types.ts";

export const columns: ColumnDef<Organization>[] = [
  {
    accessorKey: 'name',
    header: () => <div className='pl-2 text-left'>名字</div>,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
  {
    accessorKey: 'nameEn',
    header: () => <div className='pl-2 text-left'>Name</div>,
    cell: ({ row }) => {
      const name = row.getValue('nameEn') as string
      return <div className='pl-2 text-left font-medium'>{name}</div>
    },
  },
]

import { ColumnDef } from '@tanstack/react-table'

export type Exercise = {
  id: string
  name: string
}

export const columns: ColumnDef<Exercise>[] = [
  // {
  //   accessorKey: 'status',
  //   header: 'Status',
  // },
  // {
  //   accessorKey: 'email',
  //   header: 'Email',
  // },
  // {
  //   accessorKey: 'amount',
  //   header: 'Amount',
  // },
]

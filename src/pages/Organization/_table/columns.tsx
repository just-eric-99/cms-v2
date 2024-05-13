import { ColumnDef } from '@tanstack/react-table'
import { OrganizationSummaryType } from '../_data/OrganizationSummaryType'
// import { Eye, Trash2 } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { Link } from 'react-router-dom'
// import { queryClient } from '@/main'
// import { deleteOrganizationByOrgId } from '../_data/data'
// import { toast } from 'sonner'

export const columns: ColumnDef<OrganizationSummaryType>[] = [
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
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     return (
  //       <div className='flex flex-row justify-end'>
  //         <Link
  //           to={`/organizations/${(row.original as OrganizationSummaryType).id}`}
  //         >
  //           <Button size={'sm'} variant={'ghost'}>
  //             <Eye />
  //           </Button>
  //         </Link>
  //         <Button
  //           onClick={() => {
  //             deleteOrganizationByOrgId(
  //               (row.original as OrganizationSummaryType).id
  //             ).then(() => {
  //               toast.success('删除成功')
  //               queryClient.invalidateQueries({ queryKey: ['organizations'] })
  //             })
  //           }}
  //           size={'sm'}
  //           variant={'ghost'}
  //         >
  //           <Trash2 color='red' />
  //         </Button>
  //       </div>
  //     )
  //   },
  // },
]

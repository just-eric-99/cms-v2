import { Admin } from '@/network/admin/types.ts'
import { DataTable } from '@/components/table/data-table.tsx'
import { columns } from '@/pages/Admin/_table/columns.tsx'

type CenterDetailsAdminSummaryProps = {
  adminSummary: Admin[]
  centerId: string
}

export default function CenterDetailsAdminSummary({
  adminSummary,
  centerId,
}: CenterDetailsAdminSummaryProps) {
  console.log(centerId) // to use centerId in the component
  console.log(adminSummary) // to use adminSummary in the component
  return (
    <DataTable
      columns={columns}
      data={adminSummary}
      navigationPath={'/admins'}
      // createComponent={<CreateAdminPage />}
    />
  )
}

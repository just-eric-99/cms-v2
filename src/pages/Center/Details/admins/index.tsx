import { Admin } from '@/network/admin/types.ts'
import { DataTable } from '@/components/table/data-table.tsx'
import { columns } from '@/pages/Admin/_table/columns.tsx'
import AdminCreatePage from '@/pages/Admin/Create'

type CenterDetailsAdminSummaryProps = {
  adminSummary: Admin[]
  centerId: string
}

export default function CenterDetailsAdminSummary({
  adminSummary,
  centerId,
}: CenterDetailsAdminSummaryProps) {
  return (
    <DataTable
      columns={columns}
      data={adminSummary}
      navigationPath={'/admins'}
      createComponent={<AdminCreatePage preDefinedCenterId={centerId} />}
    />
  )
}

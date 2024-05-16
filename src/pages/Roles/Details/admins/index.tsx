import { Admin } from '@/network/admin/types.ts'
import { columns } from '@/pages/Admin/_table/columns.tsx'
import { DataTable } from '@/components/table/data-table.tsx'
import { Card, CardContent } from '@/components/ui/card.tsx'
import AdminCreatePage from '@/pages/Admin/Create'

type RoleDetailsAdminSummaryProps = {
  adminSummary: Admin[]
  roleId: string
}
export default function RoleDetailsAdminSummary({
  adminSummary,
  roleId
}: RoleDetailsAdminSummaryProps) {
  return (
    <Card>
      <div className='h-6' />
      <CardContent>
        <DataTable
          columns={columns}
          data={adminSummary}
          navigationPath={'/admins'}
          createComponent={<AdminCreatePage preDefinedRoleId={roleId}/>}
        />
      </CardContent>
    </Card>
  )
}

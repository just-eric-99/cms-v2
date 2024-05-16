import CreateUserPage from '@/pages/Users/Create'
import { User } from '@/network/users/types'
import { columns } from '@/pages/Users/_table/columns'
import { DataTable } from '@/components/table/data-table.tsx'

type CenterDetailsUserSummaryProps = {
  userSummary: User[]
  centerId: string
}

export default function CenterDetailsUserSummary({
  userSummary,
  centerId,
}: CenterDetailsUserSummaryProps) {
  return (
    <DataTable
      columns={columns}
      data={userSummary}
      navigationPath={'/users'}
      createComponent={<CreateUserPage centerId={centerId} />}
    />
  )
}

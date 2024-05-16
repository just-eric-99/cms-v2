import CreateUserPage from '@/pages/Users/Create'
import { User } from '@/network/users/types'
import { DataTable } from '@/pages/Users/_table/data-table'
import { columns } from '@/pages/Users/_table/columns'

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
      createComponent={<CreateUserPage centerId={centerId} />}
    />
  )
}

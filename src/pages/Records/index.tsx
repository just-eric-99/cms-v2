import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { DataTable } from '@/components/table/data-table.tsx'
import { useQuery } from '@tanstack/react-query'
import { getAllRecords } from '@/network/records/api.ts'
import { columns } from '@/pages/Records/_table/columns.tsx'
import { getUserById } from '@/network/users/api.ts'

export default function Records() {
  const query = useQuery({
    queryKey: ['records'],
    queryFn: () =>
      getAllRecords().then((records) =>
        Promise.all(
          records.map(async (record) => {
            const user = await getUserById(record.userId)
            return { ...record, userName: user.name }
          })
        )
      ),
  })

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
        <DataTable
          columns={columns}
          data={query.data ?? []}
          navigationPath={'/records'}
        />
      </LayoutBody>
    </Layout>
  )
}

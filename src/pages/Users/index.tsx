import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './table/data-table'
import { columns } from './table/columns'
import { getUsersData } from './data/logic'
import { useQuery } from '@tanstack/react-query'

export default function Users() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersData(),
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
        <DataTable columns={columns} data={query.data ?? []} />
      </LayoutBody>
    </Layout>
  )
}

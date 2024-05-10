import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './_table/data-table'
import { columns } from './_table/columns'
import { useQuery } from '@tanstack/react-query'
import { getUserSummary } from './_data/client/data'

export default function Users() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: () => getUserSummary(),
  })

  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody className='container'>
        <DataTable columns={columns} data={query.data ?? []} />
      </LayoutBody>
    </Layout>
  )
}

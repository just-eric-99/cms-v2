import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { columns } from './_table/columns'
import { useQuery } from '@tanstack/react-query'
import CreateUserPage from './Create'
import Loader from '@/components/loader.tsx'
import { DataTable } from '@/components/table/data-table.tsx'
import { getAllUsers } from '@/network/users/api.ts'

export default function Users() {
  const query = useQuery({
    queryKey: ['users'],
    queryFn: () => getAllUsers(),
  })
  if (query.isLoading) return <Loader />
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
          navigationPath={'/users'}
          createComponent={<CreateUserPage />}
        />
      </LayoutBody>
    </Layout>
  )
}

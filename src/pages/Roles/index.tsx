import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { DataTable } from '@/components/table/data-table.tsx'
import { getAllRoles } from '@/network/roles/api.ts'
import { useQuery } from '@tanstack/react-query'
import { columns } from '@/pages/Roles/_table/columns.tsx'
import Loader from '@/components/loader.tsx'
import RoleCreatePage from '@/pages/Roles/Create'

export default function Roles() {
  const query = useQuery({
    queryKey: ['roles'],
    queryFn: getAllRoles,
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
          navigationPath={'/roles'}
          createComponent={<RoleCreatePage />}
        />
      </LayoutBody>
    </Layout>
  )
}

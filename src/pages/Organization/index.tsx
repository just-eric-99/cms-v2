import { useQuery } from '@tanstack/react-query'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { columns } from './_table/columns'
import CreateOrganizationPage from './Create'
import Loader from '@/components/loader.tsx'
import { getAllOrganization } from '@/network/organization/api.ts'
import { DataTable } from '@/components/table/data-table.tsx'

export default function Organisations() {
  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: () => getAllOrganization(),
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
          navigationPath={'/organizations'}
          createComponent={<CreateOrganizationPage />}
        />
      </LayoutBody>
    </Layout>
  )
}

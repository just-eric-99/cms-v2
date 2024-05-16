import { useQuery } from '@tanstack/react-query'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { columns } from './_table/columns'
import CreateCenterPage from './Create'
import { getAllCenters } from '@/network/centers/api.ts'
import { DataTable } from '@/components/table/data-table.tsx'
import Loader from '@/components/loader.tsx'

export default function Centers() {
  const query = useQuery({
    queryKey: ['centers'],
    queryFn: getAllCenters,
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
          navigationPath={'/centers'}
          createComponent={<CreateCenterPage />}
        />
      </LayoutBody>
    </Layout>
  )
}

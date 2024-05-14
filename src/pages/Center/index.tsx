import { useQuery } from '@tanstack/react-query'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { columns } from './_table/columns'
import { DataTable } from './_table/data-table'
import { fetchCenters } from './_data/data'
import CreateCenterPage from './Create'

export default function Centers() {
  const query = useQuery({
    queryKey: ['centers'],
    queryFn: fetchCenters,
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
          createComponent={<CreateCenterPage />}
        />
      </LayoutBody>
    </Layout>
  )
}

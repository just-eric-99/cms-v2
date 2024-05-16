import { useQuery } from '@tanstack/react-query'
import { getOrganizationSummary } from './_data/data'
import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { columns } from './_table/columns'
import { DataTable } from './_table/data-table'
import CreateOrganizationPage from './Create'
import Loader from "@/components/loader.tsx";

export default function Organisations() {
  const query = useQuery({
    queryKey: ['organizations'],
    queryFn: () => getOrganizationSummary(),
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
          createComponent={<CreateOrganizationPage />}
        />
      </LayoutBody>
    </Layout>
  )
}

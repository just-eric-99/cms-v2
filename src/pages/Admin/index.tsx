import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'
import { useQuery } from '@tanstack/react-query'
import { getAllAdmins } from '@/network/admin/api.ts'
import { DataTable } from '@/components/table/data-table.tsx'
import { columns } from '@/pages/Admin/_table/columns.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import AdminCreatePage from '@/pages/Admin/Create'
import Loader from "@/components/loader.tsx";

export default function Admins() {
  const query = useQuery({
    queryKey: ['admins'],
    queryFn: () => getAllAdmins(),
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
          navigationPath={'/admins'}
          createComponent={<AdminCreatePage />}
        />
      </LayoutBody>
    </Layout>
  )
}

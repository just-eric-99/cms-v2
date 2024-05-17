import {
  Layout,
  LayoutBody,
  LayoutHeader,
} from '@/components/custom/layout.tsx'
import ThemeSwitch from '@/components/theme-switch.tsx'
import { UserNav } from '@/components/user-nav.tsx'
import { DataTable } from '@/components/table/data-table.tsx'
import { columns } from '@/pages/UserGroup/_table/columns.tsx'
import { useQuery } from '@tanstack/react-query'
import { getAllUserGroup } from '@/network/user-groups/api.ts'
import CreateUserGroupPage from '@/pages/UserGroup/Create'

export default function UserGroups() {
  const query = useQuery({
    queryKey: ['user-groups'],
    queryFn: () => getAllUserGroup(),
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
          navigationPath={'/user-groups'}
          createComponent={<CreateUserGroupPage />}
        />
      </LayoutBody>
    </Layout>
  )
}

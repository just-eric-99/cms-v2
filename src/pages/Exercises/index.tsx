import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './_table/data-table'
import { columns } from './_table/columns'
import { useQuery } from '@tanstack/react-query'
import { getExercisesTableData } from './_data/data'
import CreateExercisePage from './Create'
import Loader from '@/components/loader.tsx'

export default function Exercises() {
  const query = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getExercisesTableData(),
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
      <LayoutBody className='container justify-start'>
        <DataTable
          columns={columns}
          data={query.data ?? []}
          createComponent={<CreateExercisePage />}
        />
      </LayoutBody>
    </Layout>
  )
}

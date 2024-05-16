import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { columns } from './_table/columns'
import { useQuery } from '@tanstack/react-query'
import CreateExercisePage from './Create'
import Loader from '@/components/loader.tsx'
import { DataTable } from '@/components/table/data-table.tsx'
import { getAllExercises } from '@/network/exercises/api.ts'

export default function Exercises() {
  const query = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getAllExercises(),
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
          navigationPath='/exercises'
          createComponent={<CreateExercisePage />}
        />
      </LayoutBody>
    </Layout>
  )
}

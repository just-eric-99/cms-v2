import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './_table/data-table'
import { columns } from './_table/columns'
import { useQuery } from '@tanstack/react-query'
import { getExercisesTableData } from './_data/data'
// import ExerciseCreateDialog from './Create/dialog'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function Exercises() {
  const query = useQuery({
    queryKey: ['exercises'],
    queryFn: () => getExercisesTableData(),
  })
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
          createComponent={
            <>
              <Link to={'/exercises/create'}>
                <Button>Create</Button>
              </Link>
              {/* <ExerciseCreateDialog /> */}
            </>
          }
        />
      </LayoutBody>
    </Layout>
  )
}

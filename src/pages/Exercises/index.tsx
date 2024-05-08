import { Layout, LayoutBody, LayoutHeader } from '@/components/custom/layout'

import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'

export default function Exercises() {
  return (
    <Layout>
      <LayoutHeader>
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </LayoutHeader>
      <LayoutBody>
        {/* Add your code here */}
        <div>this is exercises</div>
      </LayoutBody>
    </Layout>
  )
}

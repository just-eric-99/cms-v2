import {Navigate, Outlet} from 'react-router-dom'
import Sidebar from './sidebar'
import useIsCollapsed from '@/hooks/use-is-collapsed'
import { isAuthenticatedAtom } from '@/state/global.ts'
import { useAtomValue } from 'jotai'

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed()

  const authenticated = useAtomValue(isAuthenticatedAtom)

  if (!authenticated) <Navigate to='/auth' />

  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main
        id='content'
        className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${
          isCollapsed ? 'md:ml-14' : 'md:ml-64'
        } h-full`}
      >
        <Outlet />
      </main>
    </div>
  )
}

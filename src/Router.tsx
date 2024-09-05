import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'
import AppShell from '@/components/app-shell'
import Exercises from '@/pages/Exercises'
import Users from '@/pages/Users'
import CreateExercisePage from '@/pages/Exercises/Create'
import Organisations from '@/pages/Organization'
import OrganizationDetailsPage from '@/pages/Organization/Details'
import Centers from '@/pages/Center'
import CenterDetailsPage from '@/pages/Center/Details'
import UserDetailsPage from '@/pages/Users/Details'
import Admins from '@/pages/Admin'
import AdminDetailsPage from '@/pages/Admin/Details'
import Roles from '@/pages/Roles'
import NotFoundError from '@/components/error/not-found.tsx'
import RoleDetailsPage from '@/pages/Roles/Details'
import UserGroups from '@/pages/UserGroup'
import UserGroupDetailsPage from '@/pages/UserGroup/Details'
import ExerciseDetailsPage from '@/pages/Exercises/Details'
import Records from '@/pages/Records'
import RecordDetails from '@/pages/Records/Details'
import { useAtomValue } from 'jotai'
import { isAuthenticatedAtom } from '@/state/global.ts'
import { useEffect } from 'react'
import CheckEmail from "@/pages/Auth/CheckEmail.tsx";
import InputPassword from "@/pages/Auth/InputPassword.tsx";
import UpdatePassword from "@/pages/Auth/UpdatePassword.tsx";
import EmailSentMessage from "@/pages/Auth/EmailSentMessage.tsx";
import VerifyMagicLink from "@/pages/Auth/VerifyMagicLink.tsx";

export default function Router() {
  const authenticated = useAtomValue(isAuthenticatedAtom)
  useEffect(() => {
    console.log('inside router authenticated', authenticated)
  }, [authenticated])
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route
          element={
            authenticated ? <Navigate to='/users' replace /> : <Outlet />
          }
        >
          <Route path='/check-email' element={<CheckEmail />} />
          <Route path='/input-password' element={<InputPassword />} />
          <Route path='/update-password' element={<UpdatePassword />} />
          <Route path='/email-sent-message' element={<EmailSentMessage />} />
          <Route path='/verify-magic-link' element={<VerifyMagicLink />} />
        </Route>

        {/* protected routes */}
        <Route
          element={
            !authenticated ? <Navigate to='/check-email' replace /> : <Outlet />
          }
        >
          <Route element={<AppShell />}>
            <Route path='/' element={<Navigate to={'/users'} />} />
            <Route path='/exercises'>
              <Route index element={<Exercises />} />
              <Route path='create' element={<CreateExercisePage />} />
              <Route
                path=':id'
                element={<ExerciseDetailsPage editable={false} />}
              />
            </Route>
            <Route path='/users'>
              <Route index element={<Users />} />
              <Route
                path=':id'
                element={<UserDetailsPage editable={false} />}
              />
            </Route>

            <Route path='/organizations'>
              <Route index element={<Organisations />} />
              <Route
                path=':id'
                element={<OrganizationDetailsPage editable={false} />}
              />
            </Route>

            <Route path='/centers'>
              <Route index element={<Centers />} />
              <Route
                path=':id'
                element={<CenterDetailsPage editable={false} />}
              />
            </Route>
            <Route path='/admins'>
              <Route index element={<Admins />} />
              <Route
                path=':id'
                element={<AdminDetailsPage editable={false} />}
              />
            </Route>

            <Route path='/roles'>
              <Route index element={<Roles />} />
              <Route
                path=':id'
                element={<RoleDetailsPage editable={false} />}
              />
            </Route>

            <Route path='/user-groups'>
              <Route index element={<UserGroups />} />
              <Route
                path=':id'
                element={<UserGroupDetailsPage editable={false} />}
              />
            </Route>

            <Route path='/records'>
              <Route index element={<Records />} />
              <Route path=':id' element={<RecordDetails />} />
            </Route>
          </Route>
        </Route>
        <Route path='*' element={<NotFoundError />} />
      </Routes>
    </BrowserRouter>
  )
}

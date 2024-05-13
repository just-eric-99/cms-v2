import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/app-shell'
import Exercises from './pages/Exercises'
import Users from './pages/Users'
import CreateExercisePage from './pages/Exercises/Create'
import Organisations from './pages/Organization'
import OrganizationDetailsPage from './pages/Organization/Details'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path='/' element={<Navigate to={'/users'} />} />
          <Route path='/exercises'>
            <Route index element={<Exercises />} />
            <Route path='create' element={<CreateExercisePage />} />
          </Route>
          <Route path='/users'>
            <Route index element={<Users />} />
          </Route>

          <Route path='/organizations'>
            <Route index element={<Organisations />} />
            <Route
              path=':id'
              element={<OrganizationDetailsPage editable={false} />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

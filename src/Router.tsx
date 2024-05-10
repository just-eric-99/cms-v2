import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/app-shell'
import Exercises from './pages/Exercises'
import Users from './pages/Users'
import UserCreatePage from './pages/Users/Create'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path='/' element={<Navigate to={'/users'} />} />
          <Route path='/exercises' element={<Exercises />} />
          <Route path='/users'>
            <Route index element={<Users />} />
            <Route path='create' element={<UserCreatePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

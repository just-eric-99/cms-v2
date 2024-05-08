import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/app-shell'
import Exercises from './pages/Exercises'
import Users from './pages/Users'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path='/' element={<Navigate to={'/users'} />} />
          <Route path='/exercises' element={<Exercises />} />
          <Route path='/users' element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

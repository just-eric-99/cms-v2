import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from '@/components/app-shell'
import Exercises from './pages/Exercises'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path='/' element={<Navigate to={'/exercises'} />} />
          <Route path='/exercises' element={<Exercises />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/app-shell'
import Exercises from './pages/Exercises'
import Users from './pages/Users'
import CreateExercisePage from './pages/Exercises/Create'

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import UserRegister from './components/User/UserRegister.jsx'
import UserLogin from './components/User/UserLogin.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/register' element={<UserRegister />} />
          <Route path='/login' element={<UserLogin />} />
        </Route>
        <Route path='/dashboard' element={<DashboardLayout />}>
          <Route index element={<h1>Dashboard</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

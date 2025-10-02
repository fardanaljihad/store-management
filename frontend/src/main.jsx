import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import Layout from './components/Layout.jsx'
import UserRegister from './components/User/UserRegister.jsx'
import UserLogin from './components/User/UserLogin.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import UserProfile from './components/User/UserProfile.jsx'
import UserLogout from './components/User/UserLogout.jsx'
import Category from './components/Category/Category.jsx'
import Product from './components/Product/Product.jsx'

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

          <Route path='users'>
            <Route path='profile' element={<UserProfile />} />
            <Route path='logout' element={<UserLogout />} />
          </Route>

          <Route path='categories'>
            <Route index element={<Category />} />
          </Route>

          <Route path='products'>
            <Route index element={<Product />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

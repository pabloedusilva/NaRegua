import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './layout/DashboardLayout'
import AuthLayout from './layout/AuthLayout'

// Auth Pages
import Login from '@barber/pages/auth/Login'
import Logout from '@barber/pages/auth/Logout'

// Dashboard Pages
import DashboardHome from '@barber/pages/dashboard/Home'
import BookingsList from '@barber/pages/schedule/BookingsList'
import BookingDetails from '@barber/pages/schedule/BookingDetails'
import ServicesList from '@barber/pages/services/ListServices'
import ProfessionalsList from '@barber/pages/settings/Staff'
import WorkingHoursSettings from '@barber/pages/settings/WorkingHours'
import BarbershopSettings from '@barber/pages/settings/Profile'
import StickersGallery from '@barber/pages/settings/StickersGallery'
import PromotionsList from '@barber/pages/promotions/PromotionsList'

export default function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="login" element={<AuthLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="logout" element={<Logout />} />

      {/* Dashboard Routes (Protected) */}
      <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
      </Route>

      <Route path="agendamentos" element={<DashboardLayout />}>
        <Route index element={<BookingsList />} />
        <Route path=":id" element={<BookingDetails />} />
      </Route>

      <Route path="servicos" element={<DashboardLayout />}>
        <Route index element={<ServicesList />} />
      </Route>

      <Route path="profissionais" element={<DashboardLayout />}>
        <Route index element={<ProfessionalsList />} />
      </Route>

      <Route path="horarios" element={<DashboardLayout />}>
        <Route index element={<WorkingHoursSettings />} />
      </Route>

      <Route path="configuracoes" element={<DashboardLayout />}>
        <Route index element={<BarbershopSettings />} />
      </Route>

      <Route path="figurinhas" element={<DashboardLayout />}>
        <Route index element={<StickersGallery />} />
      </Route>

      <Route path="promocoes" element={<DashboardLayout />}>
        <Route index element={<PromotionsList />} />
      </Route>

      {/* Redirect empty path to dashboard */}
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

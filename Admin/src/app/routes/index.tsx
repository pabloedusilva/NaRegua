import { createBrowserRouter, Navigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import { AdminGuard } from './guards/AdminGuard'
import LoginPage from '@/features/auth/pages/LoginPage'
import DashboardHome from '@/features/overview/pages/DashboardHome'
import BarbershopsList from '@/features/barbershops/pages/BarbershopsList'
import BarbersList from '@/features/barbers/pages/BarbersList'
import ClientsList from '@/features/clients/pages/ClientsList'
import BookingsList from '@/features/bookings/pages/BookingsList'
import BillingPage from '@/features/billing/pages/BillingPage'
import PlansPage from '@/features/plans/pages/PlansPage'
import PromotionsPage from '@/features/promotions/pages/PromotionsPage'
import NotificationsPage from '@/features/notifications/pages/NotificationsPage'
import ReportsPage from '@/features/reports/pages/ReportsPage'
import SettingsPage from '@/features/settings/pages/SettingsPage'
import SecurityPage from '@/features/security/pages/SecurityPage'
import MonitoringPage from '@/features/monitoring/pages/MonitoringPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/admin',
    element: <AdminGuard><DashboardLayout /></AdminGuard>,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardHome /> },
      { path: 'barbearias', element: <BarbershopsList /> },
      { path: 'barbeiros', element: <BarbersList /> },
      { path: 'clientes', element: <ClientsList /> },
      { path: 'agendamentos', element: <BookingsList /> },
      { path: 'cobrancas', element: <BillingPage /> },
      { path: 'planos', element: <PlansPage /> },
      { path: 'promocoes', element: <PromotionsPage /> },
      { path: 'notificacoes', element: <NotificationsPage /> },
      { path: 'relatorios', element: <ReportsPage /> },
      { path: 'monitoramento', element: <MonitoringPage /> },
      { path: 'configuracoes', element: <SettingsPage /> },
      { path: 'seguranca', element: <SecurityPage /> }
    ]
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
])

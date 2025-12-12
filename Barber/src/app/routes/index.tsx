import { createBrowserRouter, Navigate } from 'react-router-dom'
import RootLayout from '../layout/RootLayout'
import DashboardLayout from '../layout/DashboardLayout'
import AuthLayout from '../layout/AuthLayout'

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

// Other Pages
import OfflinePage from '@barber/pages/offline/OfflinePage'

export const router = createBrowserRouter([
  {
    path: '/admin',
    element: <RootLayout />,
    children: [
      // Auth Routes
      {
        path: 'login',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />
          }
        ]
      },
      {
        path: 'logout',
        element: <Logout />
      },

      // Dashboard Routes (Protected)
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardHome />
          }
        ]
      },
      {
        path: 'agendamentos',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <BookingsList />
          },
          {
            path: ':id',
            element: <BookingDetails />
          }
        ]
      },
      {
        path: 'servicos',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <ServicesList />
          }
        ]
      },
      {
        path: 'profissionais',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <ProfessionalsList />
          }
        ]
      },
      {
        path: 'horarios',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <WorkingHoursSettings />
          }
        ]
      },
      {
        path: 'configuracoes',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <BarbershopSettings />
          }
        ]
      },
      {
        path: 'figurinhas',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <StickersGallery />
          }
        ]
      },

      // Offline page (without layout)
      {
        path: 'offline',
        element: <OfflinePage />
      },

      // Redirect /admin root to dashboard
      {
        path: '',
        element: <Navigate to="/admin/dashboard" replace />
      },

      // Catch all - redirect to dashboard
      {
        path: '*',
        element: <Navigate to="/admin/dashboard" replace />
      }
    ]
  }
])


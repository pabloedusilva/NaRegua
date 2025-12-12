import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './providers/AuthProvider'
import { PermissionsProvider } from './providers/PermissionsProvider'
import { QueryProvider } from './providers/QueryProvider'
import { ThemeProvider } from './providers/ThemeProvider'
import { ToastProvider } from './providers/ToastProvider'

export default function App() {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          <PermissionsProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </PermissionsProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  )
}

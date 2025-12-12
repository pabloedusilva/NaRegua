import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { usePermissions } from '@/app/providers/PermissionsProvider'

interface PermissionGuardProps {
  children: ReactNode
  permission: string
  fallback?: ReactNode
}

export function PermissionGuard({ children, permission, fallback }: PermissionGuardProps) {
  const { hasPermission } = usePermissions()

  if (!hasPermission(permission)) {
    if (fallback) return <>{fallback}</>
    return <Navigate to="/admin/dashboard" replace />
  }

  return <>{children}</>
}

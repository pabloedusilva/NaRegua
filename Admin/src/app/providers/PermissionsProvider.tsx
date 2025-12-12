import { createContext, ReactNode, useContext, useMemo } from 'react'
import { useAuth } from './AuthProvider'

type Role = 'super_admin' | 'admin' | 'support'

interface PermissionsContextData {
  hasPermission: (permission: string) => boolean
  permissions: string[]
}

const PermissionsContext = createContext<PermissionsContextData>({} as PermissionsContextData)

const ROLE_PERMISSIONS: Record<Role, string[]> = {
  super_admin: [
    'barbershops.*',
    'barbers.*',
    'clients.*',
    'bookings.*',
    'billing.*',
    'reports.*',
    'settings.*',
    'security.*',
    'plans.*',
    'promotions.*',
    'notifications.*'
  ],
  admin: [
    'barbershops.view',
    'barbershops.create',
    'barbershops.edit',
    'barbershops.delete',
    'barbers.view',
    'barbers.create',
    'barbers.edit',
    'barbers.delete',
    'clients.view',
    'clients.create',
    'clients.edit',
    'bookings.view',
    'bookings.create',
    'bookings.edit',
    'bookings.cancel',
    'billing.view',
    'billing.edit',
    'reports.view',
    'settings.view',
    'settings.edit',
    'promotions.view',
    'promotions.create',
    'promotions.edit',
    'notifications.view',
    'notifications.send'
  ],
  support: [
    'barbershops.view',
    'barbers.view',
    'clients.view',
    'bookings.view',
    'billing.view',
    'reports.view',
    'settings.view',
    'promotions.view',
    'notifications.view'
  ]
}

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  const permissions = useMemo(() => {
    if (!user) return []
    return ROLE_PERMISSIONS[user.role] || []
  }, [user])

  const hasPermission = (permission: string) => {
    if (!user) return false
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true
    
    // Check for exact match
    if (permissions.includes(permission)) return true
    
    // Check for wildcard match (e.g., 'barbershops.*' matches 'barbershops.view')
    const parts = permission.split('.')
    if (parts.length === 2) {
      const wildcardPermission = `${parts[0]}.*`
      if (permissions.includes(wildcardPermission)) return true
    }
    
    return false
  }

  return (
    <PermissionsContext.Provider value={{ hasPermission, permissions }}>
      {children}
    </PermissionsContext.Provider>
  )
}

export const usePermissions = () => useContext(PermissionsContext)

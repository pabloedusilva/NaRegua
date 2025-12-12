import { usePermissions } from '../app/providers/PermissionsProvider'

export function usePermission(permission: string) {
  const { hasPermission } = usePermissions()
  return hasPermission(permission)
}

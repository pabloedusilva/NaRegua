export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  entity: string
  entityId: string
  changes: Record<string, any>
  ipAddress: string
  userAgent: string
  createdAt: string
}

export interface LoginHistory {
  id: string
  userId: string
  userName: string
  ipAddress: string
  userAgent: string
  success: boolean
  createdAt: string
}

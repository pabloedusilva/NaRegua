// Constants

export const PERMISSIONS = {
  BARBERSHOPS_VIEW: 'barbershops.view',
  BARBERSHOPS_CREATE: 'barbershops.create',
  BARBERSHOPS_EDIT: 'barbershops.edit',
  BARBERSHOPS_DELETE: 'barbershops.delete',
  BARBERSHOPS_APPROVE: 'barbershops.approve',
  BARBERSHOPS_RESET_PASSWORD: 'barbershops.reset_password',
  
  BARBERS_VIEW: 'barbers.view',
  BARBERS_CREATE: 'barbers.create',
  BARBERS_EDIT: 'barbers.edit',
  BARBERS_APPROVE: 'barbers.approve',
  
  CLIENTS_VIEW: 'clients.view',
  CLIENTS_EXPORT: 'clients.export',
  
  BOOKINGS_VIEW: 'bookings.view',
  BOOKINGS_EDIT: 'bookings.edit',
  BOOKINGS_CANCEL: 'bookings.cancel',
  
  BILLING_VIEW: 'billing.view',
  BILLING_EXPORT: 'billing.export',
  
  PLANS_MANAGE: 'plans.manage',
  PROMOTIONS_MANAGE: 'promotions.manage',
  SETTINGS_MANAGE: 'settings.manage',
  NOTIFICATIONS_SEND: 'notifications.send',
  REPORTS_VIEW: 'reports.view',
  SECURITY_MANAGE: 'security.manage',
} as const

export const BOOKING_STATUSES = {
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
} as const

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  PIX: 'pix',
  BOLETO: 'boleto',
} as const

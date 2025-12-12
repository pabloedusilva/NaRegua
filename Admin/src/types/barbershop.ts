export interface Barbershop {
  id: string
  name: string
  cnpj: string
  address: string
  phone: string
  email: string
  logo?: string
  photos?: string[]
  openingHours: Record<string, { open: string; close: string }>
  isActive: boolean
  subscriptionPlan: string
  subscriptionEndsAt: string
  createdAt: string
  updatedAt: string
}

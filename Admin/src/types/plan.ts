export interface Plan {
  id: string
  name: string
  description: string
  price: number
  billingPeriod: 'monthly' | 'quarterly' | 'yearly'
  limits: {
    barbers: number
    bookings: number
    units: number
  }
  features: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  barbershopId: string
  planId: string
  status: 'active' | 'cancelled' | 'overdue' | 'trial'
  startDate: string
  endDate: string
  autoRenew: boolean
  createdAt: string
  updatedAt: string
}

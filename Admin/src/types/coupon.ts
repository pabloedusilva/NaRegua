export interface Coupon {
  id: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  maxUses?: number
  currentUses: number
  validFrom: string
  validUntil: string
  isActive: boolean
  applicableTo: 'all' | 'barbershop' | 'global'
  targetId?: string
  createdAt: string
  updatedAt: string
}

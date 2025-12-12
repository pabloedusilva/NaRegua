export interface BillingData {
  totalRevenue: number
  platformCommission: number
  barbershopRevenue: number
  period: string
}

export interface Payment {
  id: string
  barbershopId: string
  amount: number
  method: 'credit_card' | 'debit_card' | 'pix' | 'boleto'
  status: 'pending' | 'completed' | 'failed' | 'overdue'
  dueDate: string
  paidAt?: string
  createdAt: string
}

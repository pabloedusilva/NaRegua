export interface Booking {
  id: string
  clientId: string
  clientName: string
  barberId: string
  barberName: string
  barbershopId: string
  barbershopName: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  price: number
  createdAt: string
  updatedAt: string
  editHistory?: Array<{
    editedBy: string
    editedAt: string
    changes: Record<string, any>
  }>
}

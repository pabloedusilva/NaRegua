export interface Barber {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  barbershopId: string
  services: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

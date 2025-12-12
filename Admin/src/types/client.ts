export interface Client {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  totalBookings: number
  totalNoShows: number
  createdAt: string
  updatedAt: string
}

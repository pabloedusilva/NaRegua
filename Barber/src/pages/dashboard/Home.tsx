import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import NextBookingHighlight from '@barber/components/bookings/NextBookingHighlight'

// TODO: Backend Integration - Replace localStorage with API calls
// GET /api/stats/overview - Dashboard statistics
// GET /api/bookings?status=scheduled&limit=3 - Upcoming bookings

interface DashboardStats {
  totalBarbers: number
  totalClients: number
  bookingsMonth: number
  bookingsWeek: number
  bookingsToday: number
}

interface Booking {
  id: string
  clientName: string
  clientPhone: string
  professionalId: string
  professionalName: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  price: number
  status: 'scheduled' | 'completed' | 'cancelled'
}

export default function DashboardHome() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    totalBarbers: 1,
    totalClients: 0,
    bookingsMonth: 0,
    bookingsWeek: 0,
    bookingsToday: 0
  })
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro'
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    setIsLoading(true)
    try {
      // Load bookings from localStorage (temporary - will be replaced with API)
      const bookingsRaw = localStorage.getItem('userBookings')
      const allBookings: Booking[] = bookingsRaw ? JSON.parse(bookingsRaw) : []

      // Calculate stats
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

      const scheduledBookings = allBookings.filter(b => b.status === 'scheduled')
      const uniqueClients = new Set(scheduledBookings.map(b => b.clientPhone))

      const bookingsToday = scheduledBookings.filter(b => {
        const bookingDate = new Date(b.date)
        return bookingDate.toDateString() === today.toDateString()
      }).length

      const bookingsWeek = scheduledBookings.filter(b => {
        const bookingDate = new Date(b.date)
        return bookingDate >= weekAgo
      }).length

      const bookingsMonth = scheduledBookings.filter(b => {
        const bookingDate = new Date(b.date)
        return bookingDate >= monthStart
      }).length

      setStats({
        totalBarbers: 1, // Hardcoded for demo - will come from API
        totalClients: uniqueClients.size,
        bookingsMonth,
        bookingsWeek,
        bookingsToday
      })

      // Get today's bookings (up to 4)
      const todayBookings = scheduledBookings
        .map(b => ({
          ...b,
          dateTime: new Date(`${b.date}T${b.time}`)
        }))
        .filter(b => {
          const bookingDate = new Date(b.date)
          return bookingDate.toDateString() === today.toDateString() && b.dateTime >= now
        })
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())
        .slice(0, 4)

      setUpcomingBookings(todayBookings)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId)
  }

  const confirmCancelBooking = () => {
    if (!bookingToCancel) return

    try {
      const bookingsRaw = localStorage.getItem('userBookings')
      const allBookings: Booking[] = bookingsRaw ? JSON.parse(bookingsRaw) : []
      const updated = allBookings.map(b =>
        b.id === bookingToCancel ? { ...b, status: 'cancelled' as const } : b
      )
      localStorage.setItem('userBookings', JSON.stringify(updated))
      setBookingToCancel(null)
      loadDashboardData() // Reload data to update the view
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'short', 
      day: '2-digit', 
      month: 'short' 
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { 
      style: 'currency', 
      currency: 'BRL' 
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
          Dashboard
        </h1>
        <p className="text-text-dim">
          Visão geral da sua barbearia
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 animate-fade-in-delayed">
        {/* Total Barbeiros */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Barbeiros</p>
              <p className="text-3xl font-bold text-text">{stats.totalBarbers}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Clientes */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Clientes</p>
              <p className="text-3xl font-bold text-text">{stats.totalClients}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Agendamentos do Mês */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Mês</p>
              <p className="text-3xl font-bold text-text">{stats.bookingsMonth}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Agendamentos da Semana */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Semana</p>
              <p className="text-3xl font-bold text-text">{stats.bookingsWeek}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Agendamentos Hoje */}
        <div className="stat-card card-hover group">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-text-dim text-sm mb-1">Hoje</p>
              <p className="text-3xl font-bold text-text">{stats.bookingsToday}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Agendamentos de Hoje */}
      <div className="animate-fade-in-delayed">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-text">Agendamentos de Hoje</h2>
          <button
            onClick={() => navigate('/admin/agendamentos')}
            className="text-gold hover:text-gold-600 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-text-dim">Nenhum agendamento para hoje</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Próximo Agendamento em Destaque */}
            <NextBookingHighlight booking={upcomingBookings[0]} />

            {/* Demais Agendamentos de Hoje - Estilo Cliente */}
            {upcomingBookings.slice(1).map((booking, index) => {
              const dateObj = new Date(booking.date + 'T' + booking.time)
              const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: 'short',
                year: 'numeric'
              })
              
              return (
                <div
                  key={booking.id}
                  className="bg-[#141414] border border-border rounded-2xl shadow-[var(--shadow)] p-5 transition hover:border-gold/30"
                  style={{ animationDelay: `${(index + 1) * 0.1}s` }}
                >
                  <div className="grid gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-lg font-semibold text-text">{booking.time}</div>
                        <div className="text-sm text-text/70 capitalize">{formattedDate}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-medium border bg-blue-400/15 border-blue-400/30 text-blue-400">
                        Agendado
                      </span>
                    </div>

                    <div className="grid gap-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text/70">Cliente:</span>
                        <span className="text-text font-medium">{booking.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text/70">Telefone:</span>
                        <span className="text-text font-medium">{booking.clientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text/70">Profissional:</span>
                        <span className="text-text font-medium">{booking.professionalName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text/70">Serviço:</span>
                        <span className="text-text font-medium">{booking.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text/70">Valor:</span>
                        <span className="text-gold font-semibold">R$ {booking.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border grid gap-2">
                      <button
                        onClick={() => navigate(`/admin/agendamentos/${booking.id}`)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold border bg-transparent text-text border-border transition hover:-translate-y-px w-full"
                      >
                        Ver detalhes
                      </button>
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold border bg-transparent border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400 transition hover:-translate-y-px w-full"
                      >
                        Cancelar agendamento
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      {bookingToCancel && (
        <div className="modal-overlay" onClick={() => setBookingToCancel(null)}>
          <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-text mb-4">Cancelar Agendamento</h3>
            <p className="text-text-dim mb-6">
              Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setBookingToCancel(null)}
                className="btn btn-outline flex-1"
              >
                Voltar
              </button>
              <button
                onClick={confirmCancelBooking}
                className="btn btn-danger flex-1"
              >
                Cancelar Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


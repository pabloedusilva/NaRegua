import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import NextBookingHighlight from '@barber/components/bookings/NextBookingHighlight'

// TODO: Backend Integration
// GET /api/bookings - List all bookings with filters
// DELETE /api/bookings/:id - Cancel booking

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

export default function BookingsList() {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('scheduled')
  const [dateFilter, setDateFilter] = useState(() => {
    // Define data de hoje como padrão
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [bookingToCancel, setBookingToCancel] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadBookings()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [filter, dateFilter, searchTerm, bookings])

  const loadBookings = () => {
    setIsLoading(true)
    try {
      const bookingsRaw = localStorage.getItem('userBookings')
      const allBookings: Booking[] = bookingsRaw ? JSON.parse(bookingsRaw) : []
      setBookings(allBookings)
    } catch (error) {
      console.error('Error loading bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...bookings]

    // Status filter
    if (filter !== 'all') {
      filtered = filtered.filter(b => b.status === filter)
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(b => b.date === dateFilter)
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        b =>
          b.clientName.toLowerCase().includes(term) ||
          b.clientPhone.includes(term) ||
          b.serviceName.toLowerCase().includes(term)
      )
    }

    // Sort by date and time (oldest first for upcoming)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredBookings(filtered)
  }

  // Agrupar agendamentos por data
  const groupedBookings = useMemo(() => {
    const groups: { [key: string]: Booking[] } = {}
    filteredBookings.forEach(booking => {
      if (!groups[booking.date]) {
        groups[booking.date] = []
      }
      groups[booking.date].push(booking)
    })
    return groups
  }, [filteredBookings])

  // Próximo agendamento para destaque
  const nextBooking = useMemo(() => {
    const now = new Date()
    const scheduled = bookings
      .filter(b => b.status === 'scheduled')
      .filter(b => new Date(`${b.date}T${b.time}`) >= now)
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
      })
    return scheduled.length > 0 ? scheduled[0] : null
  }, [bookings])

  const handleCancelBooking = (bookingId: string) => {
    setBookingToCancel(bookingId)
  }

  const confirmCancelBooking = () => {
    if (!bookingToCancel) return

    try {
      const updated = bookings.map(b =>
        b.id === bookingToCancel ? { ...b, status: 'cancelled' as const } : b
      )
      localStorage.setItem('userBookings', JSON.stringify(updated))
      setBookings(updated)
      setBookingToCancel(null)
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      scheduled: 'badge badge-scheduled',
      completed: 'badge badge-completed',
      cancelled: 'badge badge-cancelled'
    }
    const labels = {
      scheduled: 'Agendado',
      completed: 'Concluído',
      cancelled: 'Cancelado'
    }
    return (
      <span className={badges[status as keyof typeof badges]}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando agendamentos...</p>
        </div>
      </div>
    )
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
          Agendamentos
        </h1>
        <p className="text-text-dim">
          Visualize e gerencie todos os agendamentos
        </p>
      </div>

      {/* Próximo Agendamento em Destaque */}
      {nextBooking && (
        <div className="animate-fade-in">
          <h2 className="text-text font-semibold text-lg mb-3">Em destaque</h2>
          <NextBookingHighlight booking={nextBooking} />
        </div>
      )}

      {/* Filters */}
      <div className="card animate-fade-in-delayed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-text-dim mb-2">
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nome, telefone ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-text placeholder:text-muted focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-text-dim mb-2">
              Data
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-text-dim mb-2">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="w-full px-4 py-2 bg-surface border border-border rounded-xl text-text focus:outline-none focus:border-gold transition-colors"
            >
              <option value="all">Todos</option>
              <option value="scheduled">Agendados</option>
              <option value="completed">Concluídos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-text-dim">
            <span className="font-semibold text-text">{filteredBookings.length}</span>{' '}
            agendamento(s) encontrado(s)
          </p>
          {(filter !== 'all' || dateFilter || searchTerm) && (
            <button
              onClick={() => {
                setFilter('scheduled')
                const today = new Date()
                setDateFilter(today.toISOString().split('T')[0])
                setSearchTerm('')
              }}
              className="text-sm text-gold hover:text-gold-600 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      </div>

      {/* Data Filtrada em Destaque */}
      {dateFilter && (
        <div className="animate-fade-in-delayed">
          <h2 className="font-display text-2xl md:text-3xl text-gold capitalize">
            {formatDisplayDate(dateFilter)}
          </h2>
        </div>
      )}

      {/* Bookings List - Estilo Cliente */}
      {filteredBookings.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-text-dim">Nenhum agendamento encontrado</p>
        </div>
      ) : (
        <div className="grid gap-8 animate-fade-in-delayed">
          {Object.entries(groupedBookings).map(([date, bookingsForDate]) => (
            <div key={date} className="grid gap-4">
              {/* Cabeçalho da Data */}
              {!dateFilter && (
                <h2 className="font-display text-2xl md:text-3xl text-gold capitalize">
                  {formatDisplayDate(date)}
                </h2>
              )}
              
              {/* Cards dos Agendamentos */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookingsForDate.map((booking) => {
                  const dateObj = new Date(booking.date + 'T' + booking.time)
                  const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short',
                    year: 'numeric'
                  })
                  
                  const statusConfig = {
                    scheduled: { label: 'Agendado', color: 'text-blue-400', bg: 'bg-blue-400/15 border-blue-400/30' },
                    completed: { label: 'Concluído', color: 'text-green-400', bg: 'bg-green-400/15 border-green-400/30' },
                    cancelled: { label: 'Cancelado', color: 'text-red-400', bg: 'bg-red-400/15 border-red-400/30' }
                  }
                  const status = statusConfig[booking.status]
                  
                  // Destaca apenas o próximo agendamento
                  const isNextBooking = nextBooking?.id === booking.id
                  
                  return (
                    <div
                      key={booking.id}
                      className={`bg-[#141414] border rounded-2xl shadow-[var(--shadow)] p-5 transition ${
                        isNextBooking ? 'border-gold/50' : 'border-border hover:border-gold/30'
                      }`}
                    >
                      <div className="grid gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-lg font-semibold text-text">{booking.time}</div>
                            <div className="text-sm text-text/70 capitalize">{formattedDate}</div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${status.bg} ${status.color}`}>
                            {status.label}
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
                          {booking.status === 'scheduled' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold border bg-transparent border-red-400/30 text-red-400 hover:bg-red-400/10 hover:border-red-400 transition hover:-translate-y-px w-full"
                            >
                              Cancelar agendamento
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

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

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

// TODO: Backend Integration
// GET /api/bookings/:id - Get booking details
// PATCH /api/bookings/:id - Update booking
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

export default function BookingDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadBooking()
  }, [id])

  const loadBooking = () => {
    setIsLoading(true)
    try {
      const bookingsRaw = localStorage.getItem('userBookings')
      const allBookings: Booking[] = bookingsRaw ? JSON.parse(bookingsRaw) : []
      const found = allBookings.find(b => b.id === id)
      setBooking(found || null)
    } catch (error) {
      console.error('Error loading booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = () => {
    if (!booking) return

    try {
      const bookingsRaw = localStorage.getItem('userBookings')
      const allBookings: Booking[] = bookingsRaw ? JSON.parse(bookingsRaw) : []
      const updated = allBookings.map(b =>
        b.id === booking.id ? { ...b, status: 'cancelled' as const } : b
      )
      localStorage.setItem('userBookings', JSON.stringify(updated))
      setBooking({ ...booking, status: 'cancelled' })
      setShowCancelModal(false)
    } catch (error) {
      console.error('Error cancelling booking:', error)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
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
          <p className="text-text-dim">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="grid gap-8">
        <button
          onClick={() => navigate('/admin/agendamentos')}
          className="flex items-center gap-2 text-text-dim hover:text-text transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>
        <div className="card text-center py-12">
          <div className="w-16 h-16 rounded-full bg-surface border border-border flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-text-dim" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-text-dim">Agendamento não encontrado</p>
        </div>
      </div>
    )
  }

  const getStatusInfo = (status: string) => {
    const info = {
      scheduled: { label: 'Agendado', class: 'badge badge-scheduled' },
      completed: { label: 'Concluído', class: 'badge badge-completed' },
      cancelled: { label: 'Cancelado', class: 'badge badge-cancelled' }
    }
    return info[status as keyof typeof info]
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <button
            onClick={() => navigate('/admin/agendamentos')}
            className="flex items-center gap-2 text-text-dim hover:text-text transition-colors mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">
            Detalhes do Agendamento
          </h1>
          <p className="text-text-dim">ID: {booking.id}</p>
        </div>
        <span className={getStatusInfo(booking.status).class}>
          {getStatusInfo(booking.status).label}
        </span>
      </div>

      {/* Booking Details */}
      <div className="grid md:grid-cols-2 gap-6 animate-fade-in-delayed">
        {/* Client Info Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Informações do Cliente
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-dim mb-1">Nome</p>
              <p className="text-text font-medium">{booking.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-text-dim mb-1">Telefone</p>
              <p className="text-text font-medium">{booking.clientPhone}</p>
            </div>
          </div>
        </div>

        {/* Service Info Card */}
        <div className="card">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
            Detalhes do Serviço
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-text-dim mb-1">Serviço</p>
              <p className="text-text font-medium">{booking.serviceName}</p>
            </div>
            <div>
              <p className="text-sm text-text-dim mb-1">Profissional</p>
              <p className="text-text font-medium">{booking.professionalName}</p>
            </div>
            <div>
              <p className="text-sm text-text-dim mb-1">Valor</p>
              <p className="text-2xl font-bold text-gold">{formatCurrency(booking.price)}</p>
            </div>
          </div>
        </div>

        {/* Date & Time Card */}
        <div className="card md:col-span-2">
          <h2 className="text-xl font-semibold text-text mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Data e Horário
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-dim mb-1">Data</p>
              <p className="text-text font-medium">{formatDate(booking.date)}</p>
            </div>
            <div>
              <p className="text-sm text-text-dim mb-1">Horário</p>
              <p className="text-text font-medium">{booking.time}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      {booking.status === 'scheduled' && (
        <div className="card animate-fade-in-delayed bg-red-500/5 border-red-500/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-text mb-1">Cancelar Agendamento</h3>
              <p className="text-sm text-text-dim">
                Esta ação não pode ser desfeita. O cliente será notificado sobre o cancelamento.
              </p>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              className="btn btn-danger whitespace-nowrap"
            >
              Cancelar Agendamento
            </button>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="modal-content p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-semibold text-text mb-4">Confirmar Cancelamento</h3>
            <p className="text-text-dim mb-6">
              Tem certeza que deseja cancelar este agendamento? O cliente {booking.clientName} será notificado.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="btn btn-outline flex-1"
              >
                Voltar
              </button>
              <button
                onClick={handleCancelBooking}
                className="btn btn-danger flex-1"
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import { Check } from 'lucide-react'
import { useState } from 'react'

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

interface NextBookingHighlightProps {
  booking: Booking
  onComplete?: (bookingId: string) => void
}

export default function NextBookingHighlight({ booking, onComplete }: NextBookingHighlightProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false)

  const dateObj = new Date(booking.date + 'T' + booking.time)
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long',
    year: 'numeric'
  })

  const handleComplete = async () => {
    if (isCompleting || !onComplete) return
    
    setIsCompleting(true)
    
    // TODO: Backend Integration
    // PATCH /api/bookings/:id/complete - Mark booking as completed
    
    // Simula delay de processamento (backend)
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Mostra animação de sucesso
    setShowSuccessAnimation(true)
    
    // Aguarda 2 segundos com animação visível
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Remove animação e reseta estados
    setShowSuccessAnimation(false)
    setIsCompleting(false)
    
    // Chama callback para mostrar próximo agendamento
    onComplete(booking.id)
  }

  return (
    <div className="card border-gold/50 bg-gradient-to-br from-gold/10 to-transparent shadow-lg shadow-gold/5 relative overflow-hidden">
      {/* Animação de Sucesso */}
      {showSuccessAnimation && (
        <div className="absolute inset-0 bg-gold/15 backdrop-blur-sm z-10 flex items-center justify-center animate-fade-in">
          <div className="relative">
            {/* Círculo externo pulsante - termina após 0.6s */}
            <div 
              className="absolute inset-0 rounded-full bg-gold/30" 
              style={{ 
                animation: 'success-pulse 0.6s ease-out'
              }} 
            />
            
            {/* Círculo principal com check */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-gold to-yellow-600 flex items-center justify-center shadow-xl shadow-gold/50 animate-scale-in">
              {/* Checkmark animado */}
              <svg 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-10 md:h-10 text-bg"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{
                  strokeDasharray: '50',
                  strokeDashoffset: '50',
                  animation: 'checkmark 0.4s ease-in-out 0.2s forwards'
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-gold animate-pulse" />
          <h3 className="text-gold font-semibold text-sm uppercase tracking-wide">Próximo agendamento</h3>
        </div>
        
        <div className="grid gap-2">
          <div className="grid gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl md:text-4xl font-display text-text font-bold">{booking.time}</span>
              <span className="text-3xl md:text-4xl font-display text-text font-bold">{booking.clientName}</span>
            </div>
            <span className="text-text-dim text-sm capitalize">{formattedDate}</span>
          </div>
          
          <div className="grid gap-1 text-sm">
            <div className="flex justify-between">
              <span className="text-text-dim">Profissional:</span>
              <span className="text-text font-medium">{booking.professionalName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-dim">Serviço:</span>
              <span className="text-text font-medium">{booking.serviceName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-dim">Valor:</span>
              <span className="text-gold font-semibold">R$ {booking.price.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Botão Concluir - Redondo */}
        <div className="pt-2 border-t border-border/50">
          <button
            onClick={handleComplete}
            disabled={isCompleting}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold border transition hover:-translate-y-px w-full ${
              isCompleting
                ? 'bg-gold/20 border-gold/50 text-gold cursor-wait'
                : 'bg-gradient-to-r from-gold/10 to-yellow-600/10 border-gold/30 text-gold hover:from-gold/20 hover:to-yellow-600/20 hover:border-gold'
            }`}
          >
            {isCompleting ? (
              <>
                <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                <span>Concluindo...</span>
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
                <span>Concluir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

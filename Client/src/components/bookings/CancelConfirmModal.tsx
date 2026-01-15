import Button from '../ui/Button'
import Card from '../ui/Card'

interface CancelConfirmModalProps {
  onConfirm: () => void
  onCancel: () => void
  bookingTime: string
  bookingDate: string
}

export default function CancelConfirmModal({ onConfirm, onCancel, bookingTime, bookingDate }: CancelConfirmModalProps) {
  const dateObj = new Date(bookingDate + 'T' + bookingTime)
  const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
    weekday: 'long',
    day: '2-digit', 
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center backdrop-blur-sm bg-bg/80 p-4">
      <Card className="w-full max-w-md">
        <div className="grid gap-5">
          <div className="text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-red-400/15 border border-red-400/30 grid place-items-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-400">
                <path d="M12 9v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="font-display text-gold text-2xl md:text-3xl">Cancelar agendamento?</h2>
            <p className="text-text/70 text-sm mt-2">Esta ação não poderá ser desfeita</p>
          </div>

          <div className="bg-surface border border-border rounded-xl p-4 text-center">
            <div className="text-lg font-semibold text-text">{bookingTime}</div>
            <div className="text-sm text-text/70 capitalize mt-1">{formattedDate}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onCancel}
              className="w-full"
            >
              Voltar
            </Button>
            <Button
              variant="primary"
              onClick={onConfirm}
              className="w-full bg-red-500 border-red-500 hover:bg-red-600 text-white"
            >
              Sim, cancelar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

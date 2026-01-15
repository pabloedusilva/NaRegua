import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

export default function BookingModal({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return createPortal(
    <div className="fixed inset-0 z-[2147483647] bg-bg grid">
      <div id="booking-modal-scroll" className="relative w-full h-dvh overflow-y-auto">
        <div className="absolute top-3 left-3 z-10">
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-surface text-text hover:-translate-y-px transition"
            onClick={() => navigate('/')}
            aria-label="Voltar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}

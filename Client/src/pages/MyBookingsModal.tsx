import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMyBookings } from '@context/MyBookingsContext'
import PhoneVerificationModal from '@components/PhoneVerificationModal'
import MyBookingsPage from './MyBookingsPage'
import { createPortal } from 'react-dom'

/**
 * Wrapper component for My Bookings feature
 * Handles phone verification before allowing access
 * Similar pattern to BookingModal/BookingPage
 */
export default function MyBookingsModal() {
  const navigate = useNavigate()
  const { setUserPhone } = useMyBookings()
  const [showVerification, setShowVerification] = useState(true)

  // Check if user already has phone stored
  useEffect(() => {
    const storedPhone = localStorage.getItem('clientPhone')
    if (storedPhone) {
      const digits = storedPhone.replace(/\D/g, '')
      if (digits.length === 10 || digits.length === 11) {
        setUserPhone(digits)
        setShowVerification(false)
      }
    }
  }, [setUserPhone])

  const handleVerified = (phone: string) => {
    setUserPhone(phone)
    setShowVerification(false)
  }

  const handleClose = () => {
    navigate('/')
  }

  if (showVerification) {
    return <PhoneVerificationModal onVerified={handleVerified} onClose={handleClose} />
  }

  return (
    createPortal(
      <div className="fixed inset-0 z-[2147483647] bg-bg grid">
        <div className="relative w-full h-dvh overflow-y-auto">
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
          <div className="max-w-6xl mx-auto w-full px-4 py-6 md:py-8">
            <MyBookingsPage />
          </div>
        </div>
      </div>,
      document.body
    )
  )
}

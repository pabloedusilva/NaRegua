import { useState, FormEvent } from 'react'
import Button from '@components/ui/Button'
import Card from '@components/ui/Card'

interface PhoneVerificationModalProps {
  onVerified: (phone: string) => void
  onClose: () => void
}

export default function PhoneVerificationModal({ onVerified, onClose }: PhoneVerificationModalProps) {
  const [phoneInput, setPhoneInput] = useState('')
  const [error, setError] = useState('')

  // Try to prefill from localStorage
  useState(() => {
    const stored = localStorage.getItem('clientPhone')
    if (stored) {
      setPhoneInput(stored)
    }
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const digits = phoneInput.replace(/\D/g, '')
    if (digits.length !== 10 && digits.length !== 11) {
      setError('Formato inválido')
      return
    }

    onVerified(digits)
  }

  return (
    <div className="fixed inset-0 z-[10000] grid place-items-center backdrop-blur-sm bg-bg/80 p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text/70 hover:text-text transition"
          aria-label="Fechar"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="grid gap-5">
          <div className="text-center">
            <h2 className="font-display text-gold text-2xl md:text-3xl">Verificação</h2>
            <p className="text-text/70 text-sm mt-1">Informe seu telefone para ver seus agendamentos</p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-1.5">
              <label htmlFor="phone-verify" className="text-sm text-text/80">Telefone</label>
              <input
                id="phone-verify"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                required
                placeholder="Ex: (31) 99999-9999"
                value={phoneInput}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 11)
                  const dd = digits.slice(0, 2)
                  const rest = digits.slice(2)
                  let left = ''
                  let right = ''
                  if (rest.length >= 9) {
                    left = rest.slice(0, 5)
                    right = rest.slice(5, 9)
                  } else {
                    left = rest.slice(0, 4)
                    right = rest.slice(4, 8)
                  }
                  const parts = [dd, left, right].filter(Boolean)
                  let formatted = ''
                  if (parts[0]) formatted = `(${parts[0]}`
                  if (parts[1]) formatted += `) ${parts[1]}`
                  if (parts[2]) formatted += `-${parts[2]}`
                  setPhoneInput(formatted)
                  setError('')
                }}
                className={`w-full px-4 py-2.5 rounded-xl bg-surface border ${
                  error ? 'border-red-500' : 'border-border'
                } text-text focus:outline-none focus:border-gold transition`}
              />
              {error && <div className="text-red-500 text-xs">{error}</div>}
            </div>

            <Button type="submit" variant="primary" className="w-full">
              Continuar
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}

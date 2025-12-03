import { Link, useNavigate } from 'react-router-dom'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import { useEffect, useState } from 'react'
import ProfileAvatar from '@components/ProfileAvatar'

function isOpenNow(hours: { weekdays: [number, number]; saturday: [number, number] }) {
  const now = new Date()
  const day = now.getDay() // 0=Sun ... 6=Sat
  const hour = now.getHours()
  if (day >= 1 && day <= 5) {
    return hour >= hours.weekdays[0] && hour < hours.weekdays[1]
  }
  if (day === 6) {
    return hour >= hours.saturday[0] && hour < hours.saturday[1]
  }
  return false
}

export default function HomePage() {
  const navigate = useNavigate()
  const [clientName, setClientName] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [phoneInput, setPhoneInput] = useState('')
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})
  const [bookingsCount, setBookingsCount] = useState<number>(0)
  const [shake, setShake] = useState<boolean>(false)

  useEffect(() => {
    const name = localStorage.getItem('clientName')
    const phone = localStorage.getItem('clientPhone')
    setClientName(name)
    // If no name stored, prompt immediately on page load
    if (!name) {
      setModalOpen(true)
    }
    if (name) setNameInput(name)
    if (phone) setPhoneInput(phone)

    // Contagem de agendamentos do cliente (localStorage, status scheduled)
    try {
      const raw = localStorage.getItem('userBookings')
      const list = raw ? JSON.parse(raw) : []
      const phoneDigits = (phone || '').replace(/\D/g, '')
      const count = Array.isArray(list)
        ? list.filter((b: any) => {
            const statusOk = b?.status === 'scheduled'
            if (!phoneDigits) return statusOk
            const bDigits = String(b?.clientPhone || '').replace(/\D/g, '')
            return statusOk && bDigits === phoneDigits
          }).length
        : 0
      setBookingsCount(count)
    } catch {
      setBookingsCount(0)
    }

    // Se acabou de agendar, ativar animação sutil de sacudir
    try {
      const just = localStorage.getItem('justBooked')
      if (just === '1') {
        setShake(true)
        setTimeout(() => {
          setShake(false)
          localStorage.removeItem('justBooked')
        }, 900)
      }
    } catch {}
  }, [])

  const hours: { weekdays: [number, number]; saturday: [number, number] } = { weekdays: [8, 19], saturday: [8, 17] }
  const open = isOpenNow(hours)
  const greetingName = clientName ? clientName.split(' ')[0] : 'Visitante'
  const now = new Date()
  const todayFormatted = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })
  const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return (
    <div className="grid gap-8 md:gap-10 relative">
      {/* Ícone de prancheta no canto superior direito */}
      <button
        onClick={() => navigate('/agendamentos')}
        className={`fixed top-4 right-4 z-10 w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-gold hover:bg-[#1f1f1f] hover:border-gold/50 hover:-translate-y-0.5 transition-all shadow-lg ${shake ? 'shake-once' : ''}`}
        aria-label="Ver meus agendamentos"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 5a2 2 0 002 2h2a2 2 0 002-2 2 2 0 00-2-2h-2a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {bookingsCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white border border-red-500/80 text-xs font-bold grid place-items-center shadow-[var(--shadow)]"
            aria-label={`Você tem ${bookingsCount} agendamento(s)`}
          >
            {bookingsCount}
          </span>
        )}
      </button>

      <div className="text-center grid gap-2">
        <ProfileAvatar
          size={112}
          className="mx-auto animate-pulse-border"
          src="/assets/images/profile/profile4.jpg"
        />
        <h1 className="font-display text-3xl md:text-4xl text-text">PABLO DO CORTE</h1>
        <div className="mt-6 md:mt-8 text-left">
          <h2 className="font-semibold text-text text-xl md:text-2xl">Olá, {greetingName} <span role="img" aria-label="mão acenando">👋</span></h2>
          <div className="text-text/70 text-sm capitalize">{todayFormatted} • {timeFormatted}</div>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text">Horários</h2>
          <span className={`text-sm inline-flex items-center gap-2 ${open ? 'text-wa' : 'text-red-500'}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${open ? 'bg-wa' : 'bg-red-500'}`}></span>
            {open ? 'Aberto' : 'Fechado'}
          </span>
        </div>
        <div className="card p-4 border border-border rounded-xl bg-surface grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-text font-medium">Segunda à Sexta</div>
            <div className="text-text/70">8h às 19h</div>
          </div>
          <div className="text-right">
            <div className="text-text font-medium">Sábado</div>
            <div className="text-text/70">8h às 17h</div>
          </div>
        </div>
      </div>

      <Card>
        <div className="grid gap-4 md:gap-5 text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-surface border border-border grid place-items-center text-gold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="h-8 w-8"
            >
              <rect x="3" y="5" width="18" height="16" rx="2" ry="2" />
              <path d="M16 3v4M8 3v4M3 9h18" />
              <rect x="7" y="12" width="3" height="3" rx="0.5" />
              <rect x="12" y="12" width="3" height="3" rx="0.5" />
              <rect x="17" y="12" width="3" height="3" rx="0.5" />
            </svg>
          </div>
          <h3 className="font-semibold">Pronto para agendar?</h3>
          <p className="text-text/70">Escolha seu barbeiro preferido e o melhor horário para você.</p>
          <div className="flex flex-col items-stretch gap-3 md:gap-4">
            <Button
              variant="primary"
              className="py-3 text-base md:text-lg w-full btn-schedule"
              onClick={() => (clientName ? navigate('/agendar') : setModalOpen(true))}
            >
              Agendar Horário
            </Button>
            <Button 
              variant="outline" 
              className={`w-full relative ${shake ? 'shake-once' : ''}`}
              onClick={() => navigate('/agendamentos')}
            >
              Ver agendamentos
              {bookingsCount > 0 && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 min-w-[24px] h-[24px] px-1 rounded-full bg-red-500 text-white border border-red-500/80 text-xs font-bold grid place-items-center">
                  {bookingsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center backdrop-blur bg-bg/70">
          <div className="card p-5 w-full max-w-md">
            <h3 className="font-display text-gold text-2xl mb-3">Antes de começar</h3>
            <p className="text-text/70 mb-3">Informe seu nome completo e telefone para personalizar sua experiência.</p>
            <form
              className="grid gap-3"
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const name = (form.elements.namedItem('name') as HTMLInputElement).value.trim()
                const phone = (form.elements.namedItem('phone') as HTMLInputElement).value.trim()
                const newErrors: { name?: string; phone?: string } = {}
                if (!/^[A-Za-zÀ-ÿ]+\s+[A-Za-zÀ-ÿ].+/.test(name)) {
                  newErrors.name = 'Informe nome e sobrenome.'
                }
                const digits = phone.replace(/\D/g, '')
                if (!(digits.length === 10 || digits.length === 11)) {
                  newErrors.phone = 'Formato inválido'
                }
                if (Object.keys(newErrors).length) {
                  setErrors(newErrors)
                  return
                }
                localStorage.setItem('clientName', name)
                localStorage.setItem('clientPhone', phone)
                setClientName(name)
                setModalOpen(false)
                // Removed automatic navigation; user stays on home and can choose Agendar depois
              }}
            >
              <label className="grid gap-1">
                <span className="text-sm">Nome completo</span>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  autoFocus
                  required
                  placeholder="Ex: João Silva"
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  className={`bg-[#131313] border text-text px-3 py-2 rounded-xl ${errors.name ? 'border-red-500' : 'border-border'}`}
                />
                {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
              </label>
              <label className="grid gap-1">
                <span className="text-sm">Telefone</span>
                <input
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
                    const formatted = dd ? `(${dd}) ${left}${right ? '-' + right : ''}` : ''
                    setPhoneInput(formatted)
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }))
                  }}
                  className={`bg-[#131313] border text-text px-3 py-2 rounded-xl ${errors.phone ? 'border-red-500' : 'border-border'}`}
                />
                {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
              </label>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="primary">Continuar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

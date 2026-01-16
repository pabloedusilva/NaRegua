import { useNavigate } from 'react-router-dom'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { useEffect, useState } from 'react'
import ProfileAvatar from '@components/ProfileAvatar'
import { createPortal } from 'react-dom'

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
        className={`fixed top-4 right-4 z-10 w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-gold hover:-translate-y-0.5 transition-all shadow-lg ${shake ? 'shake-once' : ''}`}
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
        
        {/* Social Links */}
        <div className="flex items-center justify-center gap-4 mt-1">
          <a
            href="https://wa.me/5531999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface border border-border transition-all hover:-translate-y-0.5 shadow-sm"
            aria-label="WhatsApp"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-text/70"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            href="https://instagram.com/pablodocorte"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-11 h-11 rounded-xl bg-surface border border-border transition-all hover:-translate-y-0.5 shadow-sm"
            aria-label="Instagram"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-text/70"
            >
              <path
                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>

        <div className="mt-6 md:mt-8 text-left">
          <h2 className="font-semibold text-text text-xl md:text-2xl">Olá, {greetingName} <span role="img" aria-label="mão acenando">👋</span></h2>
          <div className="text-text/70 text-sm capitalize">{todayFormatted} • {timeFormatted}</div>
        </div>
      </div>

      <div className="grid gap-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text">Horários</h2>
          <span className={`text-sm inline-flex items-center gap-2 ${open ? 'text-emerald-400' : 'text-red-500'}`}>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${open ? 'bg-emerald-400 dot-pulse' : 'bg-red-500'}`}></span>
            <span className="font-medium">{open ? 'Aberto' : 'Fechado'}</span>
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
        createPortal(
          <div className="fixed inset-0 z-[2147483647] grid place-items-center backdrop-blur bg-bg/70">
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
              <Input
                label="Nome completo"
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
                error={errors.name}
              />
              <Input
                label="Telefone"
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
                error={errors.phone}
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
                <Button type="submit" variant="primary">Continuar</Button>
              </div>
            </form>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  )
}

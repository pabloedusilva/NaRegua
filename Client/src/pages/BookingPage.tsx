import { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '@context/BookingContext'
import Stepper from '@components/Stepper'
import Card from '@components/ui/Card'
import Button from '@components/ui/Button'
import Input from '@components/ui/Input'
import { professionals, services, generateTimeSlots } from '@data/availability'
import ProfessionalsCarousel from '@components/ProfessionalsCarousel'

const steps = [
  { id: 'pro', label: 'Profissional' },
  { id: 'service', label: 'Serviço' },
  { id: 'datetime', label: 'Data e horário' },
  { id: 'name', label: 'Seu nome' },
  { id: 'review', label: 'Revisar' }
]

export default function BookingPage() {
  const { state, dispatch } = useBooking()
  const [active, setActive] = useState(0)
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const today = useMemo(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
  }, [])
  const [anchorDate, setAnchorDate] = useState<string>(() => {
    const now = new Date()
    const todayFloor = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const dayOfWeek = todayFloor.getDay()
    const sunday = new Date(todayFloor)
    sunday.setDate(todayFloor.getDate() - dayOfWeek)
    const y = sunday.getFullYear()
    const m = sunday.getMonth() + 1
    const day = sunday.getDate()
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
    return `${y}-${pad(m)}-${pad(day)}`
  })

  const fmtBR = (d: Date) => d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })
  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)
  const parseISO = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const toLocalParts = (d: Date) => ({ y: d.getFullYear(), m: d.getMonth() + 1, day: d.getDate() })
  const localISO = (d: Date) => {
    const p = toLocalParts(d)
    return `${p.y}-${pad(p.m)}-${pad(p.day)}`
  }
  const addDays = (d: Date, n: number) => {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    x.setDate(x.getDate() + n)
    return x
  }
  const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1)
  const addMonths = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth() + n, 1)
  const getSundayOfWeek = (d: Date) => {
    const dayOfWeek = d.getDay()
    const sunday = new Date(d)
    sunday.setDate(d.getDate() - dayOfWeek)
    return sunday
  }
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate()
  }
  const isPastDay = (d: Date, reference: Date) => {
    return d < reference
  }

  const visibleDates = useMemo(() => {
    if (viewMode === 'weekly') {
      const base = parseISO(anchorDate)
      const arr: { iso: string; date: Date; hasSlots: boolean; isPast: boolean }[] = []
      for (let i = 0; i < 7; i++) {
        const d = addDays(base, i)
        const iso = localISO(d)
        const hasSlots = state.serviceId ? generateTimeSlots(iso, services.find(s => s.id === state.serviceId)?.duration || 30).length > 0 : true
        const isPast = isPastDay(d, today)
        arr.push({ iso, date: d, hasSlots, isPast })
      }
      return arr
    }
    return []
  }, [anchorDate, viewMode, state.serviceId, today])

  function buildMonthMatrix(anchorISO: string) {
    const base = parseISO(anchorISO)
    const firstDay = new Date(base.getFullYear(), base.getMonth(), 1)
    const lastDay = new Date(base.getFullYear(), base.getMonth() + 1, 0)
    const startOffset = firstDay.getDay()
    const totalDays = lastDay.getDate()
    const weeks: { iso: string; date: Date; isPast: boolean }[][] = []
    let week: { iso: string; date: Date; isPast: boolean }[] = []
    for (let i = 0; i < startOffset; i++) {
      week.push({ iso: '', date: new Date(NaN), isPast: false })
    }
    for (let day = 1; day <= totalDays; day++) {
      const d = new Date(base.getFullYear(), base.getMonth(), day)
      const isPast = isPastDay(d, today)
      week.push({ iso: localISO(d), date: d, isPast })
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }
    if (week.length) {
      while (week.length < 7) week.push({ iso: '', date: new Date(NaN), isPast: false })
      weeks.push(week)
    }
    return weeks
  }

  const canNext = () => {
    switch (active) {
      case 0:
        return !!state.professional
      case 1:
        return !!state.serviceId
      case 2:
        return !!state.date && !!state.time
      case 3:
        {
          const fullName = state.fullName ?? localStorage.getItem('clientName') ?? ''
          const phoneRaw = state.phone ?? localStorage.getItem('clientPhone') ?? ''
          const nameOk = /^[A-Za-zÀ-ÿ]+\s+[A-Za-zÀ-ÿ].+/.test(fullName.trim())
          const digits = phoneRaw.replace(/\D/g, '')
          const phoneOk = digits.length === 10 || digits.length === 11
          return nameOk && phoneOk
        }
      default:
        return true
    }
  }

  useEffect(() => {
    if (!state.fullName) {
      const storedName = localStorage.getItem('clientName')
      if (storedName) dispatch({ type: 'setFullName', fullName: storedName })
    }
    if (!state.phone) {
      const storedPhone = localStorage.getItem('clientPhone')
      if (storedPhone) dispatch({ type: 'setPhone', phone: storedPhone })
    }
  }, [state.fullName, state.phone, dispatch])

  useEffect(() => {
    if (state.date) {
      dispatch({ type: 'setTime', time: '' })
    }
  }, [state.date, dispatch])

  useEffect(() => {
    if (state.date) {
      const selectedDate = parseISO(state.date)
      if (viewMode === 'weekly') {
        const sundayOfSelected = getSundayOfWeek(selectedDate)
        const currentAnchor = parseISO(anchorDate)
        if (!isSameDay(sundayOfSelected, currentAnchor)) {
          setAnchorDate(localISO(sundayOfSelected))
        }
      } else {
        const currentAnchor = parseISO(anchorDate)
        if (selectedDate.getFullYear() !== currentAnchor.getFullYear() || selectedDate.getMonth() !== currentAnchor.getMonth()) {
          setAnchorDate(localISO(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)))
        }
      }
    }
  }, [state.date, viewMode])

  const next = () => setActive((a: number) => Math.min(a + 1, steps.length - 1))
  const prev = () => setActive((a: number) => Math.max(a - 1, 0))

  const confirmBooking = () => {
    // TODO: Replace with actual API call when backend is ready
    // Save booking to localStorage temporarily
    const newBooking = {
      id: `bk_${Date.now()}`,
      professionalName: state.professional?.name || '',
      serviceName: services.find(s => s.id === state.serviceId)?.name || '',
      date: state.date || '',
      time: state.time || '',
      status: 'scheduled' as const,
      clientName: state.fullName || '',
      clientPhone: state.phone || '',
      price: services.find(s => s.id === state.serviceId)?.price || 0,
      createdAt: new Date().toISOString()
    }
    
    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]')
    localStorage.setItem('userBookings', JSON.stringify([newBooking, ...existingBookings]))
    
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      navigate('/')
    }, 3000)
  }

  return (
    <div className="grid gap-8 md:gap-10">
      <div className="text-center">
        <h1 className="font-display text-gold text-4xl md:text-5xl">Agende seu horário</h1>
        <p className="text-text/70 mt-2">Selecione o profissional, data e horário, informe seu nome e confirme.</p>
      </div>

      <Stepper steps={steps} active={active} />
      {
        /* Ref para permitir scroll automático até o botão Continuar dentro do modal */
      }
      <Card>
        {(() => {
          const scrollRef = useRef<HTMLDivElement | null>(null)
          // armazenar em variável para uso abaixo
          const content = (
            <div ref={scrollRef} className="grid gap-7 md:gap-8 max-h-[75vh] overflow-y-auto">

          {active === 0 && (
            <section className="grid gap-3">
              <h2 className="text-gold font-display text-2xl">Profissional</h2>
              <ProfessionalsCarousel
                items={professionals}
                activeId={state.professional?.id}
                onSelect={(pro) => dispatch({ type: 'setProfessional', professional: pro })}
              />
            </section>
          )}

          {active === 1 && (
            <section className="grid gap-3">
              <h2 className="text-gold font-display text-2xl">Serviço</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {services.map((svc) => (
                  <button
                    key={svc.id}
                    className={`card p-3 text-left transition border hover:-translate-y-0.5 hover:shadow-brand ${state.serviceId === svc.id ? 'border-gold ring-2 ring-gold/30' : 'border-border'}`}
                    onClick={() => {
                      dispatch({ type: 'setService', serviceId: svc.id })
                      // após selecionar o serviço, rolar suavemente até o final para expor o botão Continuar
                      requestAnimationFrame(() => {
                        if (scrollRef.current) {
                          scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
                        }
                      })
                    }}
                  >
                    <div className="h-32 md:h-36 rounded-xl bg-surface border border-border mb-3 grid place-items-center text-muted">Imagem</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold">{svc.name}</div>
                        <div className="text-xs text-text/70">Duração: {svc.duration}min</div>
                      </div>
                      <div className="px-2 py-1 rounded-lg bg-gold/15 text-gold border border-gold text-sm font-semibold">R$ {svc.price.toFixed(2)}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {active === 2 && (
            <section className="grid gap-3">
              <h2 className="text-gold font-display text-2xl">Data e horário</h2>
              <div className="grid gap-5 md:gap-6">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm text-text/70">Escolha a data</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-3 py-1 rounded-lg text-sm border ${viewMode === 'weekly' ? 'bg-gold/15 text-gold border-gold' : 'bg-surface text-text border-border'}`}
                        onClick={() => setViewMode('weekly')}
                      >Semanal</button>
                      <button
                        className={`px-3 py-1 rounded-lg text-sm border ${viewMode === 'monthly' ? 'bg-gold/15 text-gold border-gold' : 'bg-surface text-text border-border'}`}
                        onClick={() => setViewMode('monthly')}
                      >Mensal</button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      aria-label="Anterior"
                      className="px-3 py-1 rounded-lg border border-border bg-surface text-text disabled:opacity-50 inline-flex items-center"
                      disabled={(() => {
                        const base = parseISO(anchorDate)
                        if (viewMode === 'weekly') {
                          const prev = addDays(base, -7)
                          return prev < today
                        }
                        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
                        const prevMonth = addMonths(base, -1)
                        return prevMonth < currentMonthStart
                      })()}
                      onClick={() => {
                        const base = parseISO(anchorDate)
                        if (viewMode === 'weekly') {
                          const prev = addDays(base, -7)
                          if (prev < today) return
                          setAnchorDate(localISO(prev))
                          return
                        }
                        const prevMonth = addMonths(base, -1)
                        const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
                        if (prevMonth < currentMonthStart) return
                        setAnchorDate(localISO(prevMonth))
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <div className="text-text/70 text-sm">
                      {viewMode === 'weekly' ? `${fmtBR(parseISO(anchorDate))} • próximos 7 dias` : parseISO(anchorDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </div>
                    <button
                      aria-label="Próximo"
                      className="px-3 py-1 rounded-lg border border-border bg-surface text-text inline-flex items-center disabled:opacity-50"
                      onClick={() => {
                        const base = parseISO(anchorDate)
                        const next = viewMode === 'weekly' ? addDays(base, 7) : addMonths(base, 1)
                        setAnchorDate(localISO(next))
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-text">
                        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  {viewMode === 'weekly' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {visibleDates.map(({ iso, date, isPast }) => (
                        <button
                          key={iso}
                          disabled={isPast}
                          className={`px-3 py-2 rounded-xl border text-sm transition ${
                            isPast
                              ? 'border-border bg-surface text-text/50 cursor-not-allowed opacity-50'
                              : state.date === iso
                                ? 'border-gold bg-gold/10 text-gold'
                                : 'border-border bg-surface text-text'
                          } ${isPast ? '' : 'hover:-translate-y-0.5 hover:shadow-brand'}`}
                          onClick={() => {
                            if (isPast) return
                            dispatch({ type: 'setDate', date: iso })
                            setTimeout(() => {
                              if (scrollRef.current) {
                                scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
                              }
                            }, 200)
                          }}
                        >
                          {fmtBR(date)}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid gap-3 md:gap-4">
                      <div className="grid grid-cols-7 text-center text-xs text-text/70">
                        {['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map((d) => (
                          <div key={d}>{d}</div>
                        ))}
                      </div>
                      {buildMonthMatrix(anchorDate).map((week, wi) => (
                        <div key={wi} className="grid grid-cols-7 gap-1">
                          {week.map((cell, ci) => (
                            cell.iso ? (
                              <button
                                key={cell.iso}
                                className={`px-2 py-2 rounded-lg border text-xs md:text-sm transition ${
                                  cell.isPast
                                    ? 'border-border bg-surface text-text/50 cursor-not-allowed opacity-50'
                                    : state.date === cell.iso
                                      ? 'border-gold bg-gold/10 text-gold'
                                      : 'border-border bg-surface text-text'
                                } ${cell.isPast ? '' : 'hover:-translate-y-0.5 hover:shadow-brand'}`}
                                disabled={cell.isPast}
                                onClick={() => {
                                  if (cell.isPast) return
                                  dispatch({ type: 'setDate', date: cell.iso })
                                  setTimeout(() => {
                                    if (scrollRef.current) {
                                      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
                                    }
                                  }, 200)
                                }}
                              >
                                {cell.date.getDate()}
                              </button>
                            ) : (
                              <div key={`blank-${ci}`} className="px-2 py-2 rounded-lg border border-transparent" />
                            )
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                  <div className="grid gap-3 md:gap-4">
                  <h3 className="text-sm text-text/70">Escolha o horário</h3>
                  {(() => {
                    if (!state.date || !state.professional) return <div className="text-text/60 text-sm">Selecione uma data.</div>
                    if (!state.serviceId) return <div className="text-text/60 text-sm">Selecione um serviço primeiro.</div>
                    
                    const selected = parseISO(state.date)
                    const isSunday = selected.getDay() === 0
                    
                    if (isSunday) {
                      return <div className="text-text/70 text-sm">Sem horários disponíveis aos domingos</div>
                    }
                    
                    const selectedService = services.find(s => s.id === state.serviceId)
                    if (!selectedService) return <div className="text-text/60 text-sm">Serviço não encontrado.</div>
                    
                    const slots = generateTimeSlots(state.date, selectedService.duration)
                    
                    if (!slots.length) {
                      return <div className="text-text/70 text-sm">Sem horários disponíveis</div>
                    }
                    return (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {slots.map((t) => (
                          <button
                            key={t}
                            className={`px-2 py-1.5 rounded-lg border text-xs font-medium transition ${state.time === t ? 'border-gold bg-gold/10 text-gold' : 'border-border bg-surface text-text hover:border-gold/50'}`}
                            onClick={() => dispatch({ type: 'setTime', time: t })}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    )
                  })()}
                </div>
              </div>
            </section>
          )}

          {active === 3 && (
            <section className="grid gap-3">
              <h2 className="text-gold font-display text-2xl">Seus dados</h2>
              <div className="grid md:grid-cols-2 gap-3">
                <Input
                  label="Nome completo"
                  placeholder="Ex: João da Silva"
                  value={state.fullName ?? localStorage.getItem('clientName') ?? ''}
                  onChange={(e) => dispatch({ type: 'setFullName', fullName: e.target.value })}
                  hint="Usaremos para identificar seu agendamento."
                />
                <Input
                  label="Telefone"
                  placeholder="(00) 00000-0000"
                  value={state.phone ?? localStorage.getItem('clientPhone') ?? ''}
                  onChange={(e) => dispatch({ type: 'setPhone', phone: e.target.value })}
                  hint="Para contato e confirmação."
                />
              </div>
            </section>
          )}

          {active === 4 && (
            <section className="grid gap-3">
              <h2 className="text-gold font-display text-2xl">Revisar e confirmar</h2>
              <Card className="p-4 grid gap-2">
                <div><span className="text-text/70">Profissional:</span> {state.professional?.name}</div>
                <div><span className="text-text/70">Data:</span> {state.date}</div>
                <div><span className="text-text/70">Horário:</span> {state.time}</div>
                <div><span className="text-text/70">Nome:</span> {state.fullName}</div>
              </Card>
              {/* Botões de ação removidos conforme solicitação */}
            </section>
          )}

          <div className="sticky bottom-0 bg-[#141414] grid grid-cols-2 gap-2 pt-3 md:pt-4 safe-area-bottom">
            <Button
              variant="outline"
              onClick={prev}
              disabled={active === 0}
              className="w-full h-10 md:h-11 text-sm md:text-base"
            >
              Voltar
            </Button>
            <Button
              variant="primary"
              onClick={() => (active < steps.length - 1 ? next() : confirmBooking())}
              disabled={!canNext()}
              className="w-full h-10 md:h-11 text-sm md:text-base"
            >
              {active < steps.length - 1 ? 'Continuar' : 'Confirmar'}
            </Button>
          </div>
            </div>
          )
          return content
        })()}
      </Card>

      {success && (
        <div className="success-overlay" role="alert" aria-live="assertive">
          <div className="success-card">
            <div className="success-icon" aria-hidden="true">
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                <circle className="success-ring" cx="32" cy="32" r="26" />
                <path className="success-check" d="M20 34l8 8 16-18" />
              </svg>
            </div>
            <div className="success-text">Agendamento confirmado!</div>
          </div>
        </div>
      )}
    </div>
  )
}

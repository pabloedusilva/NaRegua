import { useEffect, useState } from 'react'

// TODO: Backend Integration
// GET /api/settings/hours - Get working hours
// PUT /api/settings/hours - Update working hours

interface DaySchedule {
  enabled: boolean
  openTime: string
  closeTime: string
  breakStart: string
  breakEnd: string
}

interface WorkingHours {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

const defaultSchedule: DaySchedule = {
  enabled: true,
  openTime: '08:00',
  closeTime: '18:00',
  breakStart: '12:00',
  breakEnd: '14:00'
}

const dayNames = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
}

export default function WorkingHours() {
  const [hours, setHours] = useState<WorkingHours>({
    monday: defaultSchedule,
    tuesday: defaultSchedule,
    wednesday: defaultSchedule,
    thursday: defaultSchedule,
    friday: defaultSchedule,
    saturday: { ...defaultSchedule, closeTime: '17:00' },
    sunday: { enabled: false, openTime: '', closeTime: '', breakStart: '', breakEnd: '' }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    loadHours()
  }, [])

  const loadHours = () => {
    setIsLoading(true)
    try {
      const hoursRaw = localStorage.getItem('barbershop_hours')
      if (hoursRaw) {
        setHours(JSON.parse(hoursRaw))
      } else {
        localStorage.setItem('barbershop_hours', JSON.stringify(hours))
      }
    } catch (error) {
      console.error('Error loading hours:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateDay = (day: keyof WorkingHours, field: keyof DaySchedule, value: any) => {
    setHours({
      ...hours,
      [day]: {
        ...hours[day],
        [field]: value
      }
    })
  }

  const handleSave = () => {
    setIsSaving(true)
    try {
      localStorage.setItem('barbershop_hours', JSON.stringify(hours))
      setTimeout(() => {
        setIsSaving(false)
      }, 500)
    } catch (error) {
      console.error('Error saving hours:', error)
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-dim">Carregando horários...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Horários de Funcionamento</h1>
        <p className="text-text-dim">Configure os horários de atendimento da sua barbearia</p>
      </div>

      {/* Days Schedule */}
      <div className="grid gap-4 animate-fade-in-delayed">
        {Object.entries(hours).map(([day, schedule]) => (
          <div key={day} className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text">
                {dayNames[day as keyof typeof dayNames]}
              </h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <span className="text-sm text-text-dim">Aberto</span>
                <input
                  type="checkbox"
                  checked={schedule.enabled}
                  onChange={(e) => updateDay(day as keyof WorkingHours, 'enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-border bg-surface text-gold focus:ring-2 focus:ring-gold/60"
                />
              </label>
            </div>

            {schedule.enabled && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-text-dim mb-1">Abertura</label>
                  <input
                    type="time"
                    value={schedule.openTime}
                    onChange={(e) => updateDay(day as keyof WorkingHours, 'openTime', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Fechamento</label>
                  <input
                    type="time"
                    value={schedule.closeTime}
                    onChange={(e) => updateDay(day as keyof WorkingHours, 'closeTime', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Pausa Início</label>
                  <input
                    type="time"
                    value={schedule.breakStart}
                    onChange={(e) => updateDay(day as keyof WorkingHours, 'breakStart', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-dim mb-1">Pausa Fim</label>
                  <input
                    type="time"
                    value={schedule.breakEnd}
                    onChange={(e) => updateDay(day as keyof WorkingHours, 'breakEnd', e.target.value)}
                    className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-text text-sm focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="btn btn-primary min-w-[200px]"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  )
}

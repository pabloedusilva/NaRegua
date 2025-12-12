import Input from '@/components/ui/Input'

interface DateRangeFilterProps {
  startDate: string
  endDate: string
  onChange: (dates: { startDate: string; endDate: string }) => void
  label?: string
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onChange,
  label = 'Período'
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-text-dim">
          {label}
        </label>
      )}
      <div className="flex gap-3">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => onChange({ startDate: e.target.value, endDate })}
          placeholder="Data inicial"
          className="flex-1"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => onChange({ startDate, endDate: e.target.value })}
          placeholder="Data final"
          className="flex-1"
        />
      </div>
    </div>
  )
}

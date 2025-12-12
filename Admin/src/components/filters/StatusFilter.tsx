import Select from '@/components/ui/Select'

interface StatusOption {
  value: string
  label: string
}

interface StatusFilterProps {
  options: StatusOption[]
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export default function StatusFilter({
  options,
  value,
  onChange,
  label = 'Status',
  placeholder = 'Selecione um status'
}: StatusFilterProps) {
  return (
    <Select
      label={label}
      options={options}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}

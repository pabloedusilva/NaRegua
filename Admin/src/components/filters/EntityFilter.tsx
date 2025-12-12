import Select from '@/components/ui/Select'

interface EntityOption {
  value: string
  label: string
}

interface EntityFilterProps {
  label: string
  options: EntityOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function EntityFilter({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção'
}: EntityFilterProps) {
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

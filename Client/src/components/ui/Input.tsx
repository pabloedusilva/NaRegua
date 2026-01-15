type Props = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; error?: string }

export default function Input({ label, hint, error, ...props }: Props) {
  const { className, ...rest } = props
  const mergedClassName = [
    'w-full h-11 px-4 rounded-xl',
    'bg-surface border',
    error ? 'border-red-500' : 'border-border',
    'text-text text-base',
    'placeholder:text-text/40',
    'appearance-none',
    'focus:outline-none focus:ring-2 focus:ring-gold/60 focus:border-gold/70',
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <label className="grid gap-1">
      {label && <span className="text-sm text-text/90">{label}</span>}
      <input
        {...rest}
        className={mergedClassName}
      />
      <div className="min-h-5 text-xs">
        {error ? <span className="text-red-500">{error}</span> : hint ? <span className="text-muted">{hint}</span> : null}
      </div>
    </label>
  )
}

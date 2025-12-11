type Props = React.SelectHTMLAttributes<HTMLSelectElement> & { 
  label?: string
  hint?: string
  error?: string 
}

export default function Select({ label, hint, error, children, ...props }: Props) {
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm text-text/90">{label}</span>}
      <select
        {...props}
        className={`bg-[#131313] border ${error ? 'border-red-500' : 'border-border'} text-text px-3 py-2 rounded-xl font-inherit focus:outline-none focus:ring-2 focus:ring-gold/60 transition-all cursor-pointer`}
      >
        {children}
      </select>
      <div className="min-h-5 text-xs">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : hint ? (
          <span className="text-muted">{hint}</span>
        ) : null}
      </div>
    </label>
  )
}

type Props = React.InputHTMLAttributes<HTMLInputElement> & { 
  label?: string
  hint?: string
  error?: string 
  icon?: React.ReactNode
}

export default function Input({ label, hint, error, icon, ...props }: Props) {
  return (
    <label className="grid gap-1">
      {label && <span className="text-sm text-text/90">{label}</span>}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text/50">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`bg-[#131313] border ${error ? 'border-red-500' : 'border-border'} text-text ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 rounded-xl font-inherit focus:outline-none focus:ring-2 focus:ring-gold/60 transition-all w-full`}
        />
      </div>
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

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  { label, error, hint, icon, className, ...props },
  ref
) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-sm text-text/90">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full bg-[#131313] border px-3 py-2 rounded-xl font-inherit text-text',
            icon && 'pl-10',
            'placeholder:text-muted',
            'focus:outline-none focus:ring-2 focus:ring-gold/60',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            error ? 'border-red-500 focus:ring-red-500' : 'border-border',
            className
          )}
          {...props}
        />
      </div>
      <div className="min-h-5 text-xs">
        {error ? (
          <span className="text-red-500">{error}</span>
        ) : hint ? (
          <span className="text-muted">{hint}</span>
        ) : null}
      </div>
    </div>
  )
})

Input.displayName = 'Input'

export { Input }
export default Input


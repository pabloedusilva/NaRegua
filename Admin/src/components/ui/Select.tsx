import { SelectHTMLAttributes, forwardRef, ReactNode } from 'react'
import clsx from 'clsx'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options?: SelectOption[]
  placeholder?: string
  children?: ReactNode
}

const Select = forwardRef<HTMLSelectElement, SelectProps>((
  { label, error, options, placeholder, className, children, ...props },
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
      <select
        ref={ref}
        className={clsx(
          'w-full bg-[#131313] border px-3 py-2 rounded-xl font-inherit text-text',
          'focus:outline-none focus:ring-2 focus:ring-gold/60',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          error ? 'border-red-500 focus:ring-red-500' : 'border-border',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children || options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="text-sm text-red-500">{error}</span>
      )}
    </div>
  )
})

Select.displayName = 'Select'

export { Select }
export default Select
 

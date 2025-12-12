import { InputHTMLAttributes } from 'react'
import clsx from 'clsx'

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

function Switch({ label, className, ...props }: SwitchProps) {
  return (
    <label className={clsx('inline-flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-border rounded-full peer-checked:bg-gold transition-colors" />
        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
      </div>
      {label && <span className="text-sm text-text">{label}</span>}
    </label>
  )
}

export { Switch }
export default Switch
 

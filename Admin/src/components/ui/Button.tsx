import clsx from 'clsx'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'outline' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
}

export default function Button({ 
  className, 
  variant = 'primary', 
  size = 'md',
  loading, 
  fullWidth,
  children, 
  ...props 
}: Props) {
  return (
    <button
      className={clsx(
        'btn',
        variant === 'primary' && 'btn-primary',
        variant === 'outline' && 'btn-outline',
        variant === 'danger' && 'btn-danger',
        variant === 'success' && 'btn-success',
        variant === 'ghost' && 'bg-transparent text-text hover:bg-surface',
        'disabled:cursor-not-allowed disabled:opacity-100 disabled:bg-[#2a2a2a] disabled:text-text/40 disabled:border-border',
        fullWidth && 'w-full',
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      <span className={clsx('btn-text', loading && 'opacity-0')}>{children}</span>
      {loading && (
        <span className="btn-spinner">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" />
          </svg>
        </span>
      )}
    </button>
  )
}

export { Button }

 

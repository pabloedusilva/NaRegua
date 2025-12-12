import { ReactNode } from 'react'
import clsx from 'clsx'

interface BadgeProps {
  children: ReactNode
  variant?: 'scheduled' | 'completed' | 'cancelled' | 'pending' | 'default'
  color?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Badge({ children, variant = 'default', color, size = 'md', className }: BadgeProps) {
  const variants = {
    scheduled: 'badge-scheduled',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
    pending: 'badge-pending',
    default: 'bg-border/50 text-text border border-border'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm'
  }

  // Se color for fornecida, use ela; senão use variant
  const colorClass = color ? `bg-${color}-500/20 text-${color}-400 border border-${color}-500/30` : variants[variant]

  return (
    <span className={clsx('badge', sizes[size], colorClass, className)}>
      {children}
    </span>
  )
}

export default Badge


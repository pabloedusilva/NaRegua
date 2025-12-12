import { FormHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode
}

export default function Form({ children, className, ...props }: FormProps) {
  return (
    <form className={clsx('space-y-4', className)} {...props}>
      {children}
    </form>
  )
}

interface FormGroupProps {
  children: ReactNode
  className?: string
}

export function FormGroup({ children, className }: FormGroupProps) {
  return <div className={clsx('space-y-2', className)}>{children}</div>
}

interface FormActionsProps {
  children: ReactNode
  className?: string
}

export function FormActions({ children, className }: FormActionsProps) {
  return (
    <div className={clsx('flex gap-3 justify-end pt-4', className)}>
      {children}
    </div>
  )
}

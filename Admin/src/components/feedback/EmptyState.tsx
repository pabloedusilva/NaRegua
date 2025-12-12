import { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  message?: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

function EmptyState({ title, message, description, icon, action }: EmptyStateProps) {
  const displayMessage = message || description

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && <div className="text-text-muted mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      {displayMessage && <p className="text-sm text-text-dim mb-6 max-w-md">{displayMessage}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

export { EmptyState }
export default EmptyState

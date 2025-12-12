import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

interface ModalProps {
  isOpen?: boolean
  open?: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
  className?: string
}

export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  children,
  size = 'md',
  className
}: ModalProps) {
  const modalOpen = isOpen ?? open ?? false

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [modalOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [modalOpen, onClose])

  if (!modalOpen) return null

  // Fullscreen modal style (como no Barber)
  if (size === 'fullscreen') {
    return createPortal(
      <div className="modal-fullscreen">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              {title && (
                <>
                  <h2 className="font-display text-3xl md:text-4xl text-gold mb-2">
                    {title}
                  </h2>
                  <p className="text-text-dim">Preencha os dados necessários</p>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full hover:bg-surface flex items-center justify-center text-text-dim hover:text-text transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div>{children}</div>
        </div>
      </div>,
      document.body
    )
  }

  // Regular modal sizes
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={clsx('modal-content', sizes[size as keyof typeof sizes], className)}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-xl font-semibold text-text">{title}</h2>
            <button
              onClick={onClose}
              className="text-text-dim hover:text-text transition-colors"
              aria-label="Fechar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>,
    document.body
  )
}

export { Modal }

import { useState, FormEvent } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface PasswordPromptDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (password: string) => void
  title: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export default function PasswordPromptDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message = 'Por favor, insira sua senha para confirmar esta ação.',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar'
}: PasswordPromptDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    
    if (!password.trim()) {
      setError('Senha é obrigatória')
      return
    }

    onConfirm(password)
    handleClose()
  }

  const handleClose = () => {
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-text-dim text-sm">{message}</p>
        
        <Input
          type="password"
          label="Senha"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError('')
          }}
          error={error}
          placeholder="Digite sua senha"
          autoFocus
          required
          fullWidth
        />
        
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={handleClose}>
            {cancelText}
          </Button>
          <Button type="submit" variant="danger">
            {confirmText}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

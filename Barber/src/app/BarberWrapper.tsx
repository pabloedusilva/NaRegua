import { useEffect } from 'react'
import App from './App'
import { ToastProvider } from './providers/ToastProvider'
import '../styles/index.css'

export default function BarberWrapper() {
  useEffect(() => {
    // Adiciona classes específicas do admin no body
    document.body.classList.add('admin-mode')
    return () => {
      document.body.classList.remove('admin-mode')
    }
  }, [])

  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}

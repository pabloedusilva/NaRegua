import { useState, useEffect, useRef } from 'react'

type ConnectionState = 'online' | 'offline' | 'reconnected'

export function useConnectionStatus() {
  const [status, setStatus] = useState<ConnectionState>('online')
  const [showBanner, setShowBanner] = useState(false)
  const wasOnlineOnMount = useRef(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      // Se estava offline antes, mostra banner de reconexão
      if (!navigator.onLine || status === 'offline') {
        setStatus('reconnected')
        setShowBanner(true)
        
        // Auto-fecha o banner verde após 4 segundos
        setTimeout(() => {
          setShowBanner(false)
        }, 4000)
      }
    }

    const handleOffline = () => {
      setStatus('offline')
      setShowBanner(true)
    }

    // Listeners nativos
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Verifica estado inicial apenas se já estava offline ao montar
    if (!wasOnlineOnMount.current) {
      setStatus('offline')
      setShowBanner(true)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [status])

  return { status, showBanner, isOnline: navigator.onLine }
}

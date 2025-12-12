import { useEffect } from 'react'
import App from './App'
import { ToastProvider } from './providers/ToastProvider'
import { initPWA } from '@barber/utils/pwa'
import '../styles/index.css'

export default function BarberWrapper() {
  useEffect(() => {
    // Inicializa configurações PWA para experiência mobile nativa
    initPWA()
    
    // Adiciona classes específicas do admin no body
    document.body.classList.add('admin-mode')

    // Injeta manifest do Barber (escopo /admin/) se não existir
    const existingManifest = document.querySelector('link[rel="manifest"]') as HTMLLinkElement | null
    if (!existingManifest) {
      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = '/admin/manifest.json'
      link.crossOrigin = 'use-credentials'
      document.head.appendChild(link)
    }

    // Meta tags PWA (theme-color e iOS capabilities)
    const ensureMeta = (name: string, content: string, media?: string) => {
      let meta = document.querySelector(`meta[name='${name}']`) as HTMLMetaElement | null
      if (!meta) {
        meta = document.createElement('meta')
        meta.name = name
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
      if (media) meta.setAttribute('media', media)
    }
    ensureMeta('theme-color', '#C9953B')
    ensureMeta('theme-color', '#0a0a0a', '(prefers-color-scheme: dark)')
    ensureMeta('apple-mobile-web-app-capable', 'yes')
    ensureMeta('apple-mobile-web-app-status-bar-style', 'black-translucent')

    // Registra Service Worker apenas no contexto do Barber (/admin)
    if ('serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker
          .register('/admin/sw.js', { scope: '/admin/' })
          .then((registration) => {
            if (import.meta.env.DEV) {
              console.log('[SW] Registered:', registration.scope)
            }
            // Atualiza periodicamente
            const interval = setInterval(() => registration.update(), 60_000)
            // Cleanup do intervalo na desmontagem
            return () => clearInterval(interval)
          })
          .catch((err) => {
            console.error('[SW] Registration failed:', err)
          })
      }

      // Aguarda carregamento
      if (document.readyState === 'complete') registerSW()
      else window.addEventListener('load', registerSW, { once: true })
    }
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

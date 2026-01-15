import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ToastProvider } from './providers/ToastProvider'
import { initPWA } from '@barber/utils/pwa'
import { initAppIcon } from '@barber/lib/appIcon'
import '@barber/styles/index.css'

// Inicializa PWA
initPWA()

// Inicializa ícone selecionável (PWA / favicon)
initAppIcon('/assets/images/logoSelect/1.jpg')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>
)

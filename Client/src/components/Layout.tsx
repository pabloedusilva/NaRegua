import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header removido conforme solicitação para manter o código limpo */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-10">
        {children}
      </main>
      <footer id="contato" className="site-footer mt-auto">
        <div className="footer-inner">
          <div className="footer-top">
            <img src="/assets/images/logos/logo.png" alt="Régua Máxima" className="brand-logo" />
          </div>
          <div className="footer-bottom">
            <div className="footer-legal">
              <span className="copyright">&copy; Régua Máxima todos os direitos reservados 2026</span>
              <nav className="footer-links" aria-label="Links legais">
                <Link to="/termos">Termos de uso</Link>
                <Link to="/privacidade">Política de Privacidade</Link>
                <Link to="/sobre">Sobre</Link>
              </nav>
            </div>
            <div className="footer-social" aria-label="Redes e contato">
              <a href="mailto:contato@naregua.app" aria-label="Enviar e-mail">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m22 8-10 7L2 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </a>
              <a href="https://instagram.com/naregua.app" target="_blank" rel="noopener" aria-label="Abrir Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="12" cy="12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="17.3" cy="6.7" r="1.3" fill="currentColor" />
                </svg>
              </a>
              <a href="https://wa.me/5531985079718" target="_blank" rel="noopener" aria-label="Abrir WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                  <path d="M12 2a9.93 9.93 0 0 0-8.48 15.34L2 22l4.78-1.49A10 10 0 1 0 12 2Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M17.44 16.35c-.23.64-1.14 1.17-1.77 1.25-.47.06-1.08.09-1.75-.11-.41-.13-.94-.31-1.62-.61-2.84-1.24-4.68-4.17-4.82-4.37-.14-.2-1.16-1.55-1.16-2.96 0-1.41.73-2.09 1-2.38.27-.29.59-.36.79-.36.2 0 .4 0 .57.01.18.01.43-.07.68.52.23.55.77 1.9.84 2.04.07.14.12.3.02.49-.1.2-.16.32-.3.49-.14.17-.3.38-.43.51-.14.14-.3.29-.13.57.16.29.71 1.17 1.52 1.9 1.04.93 1.92 1.22 2.2 1.36.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.37-.23.62-.14.25.09 1.59.75 1.86.89.27.14.45.21.52.33.07.12.07.68-.16 1.32Z" fill="currentColor" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

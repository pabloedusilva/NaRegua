import { Link, useNavigate } from 'react-router-dom'
import Button from '@components/ui/Button'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div>
      {/* Header idêntico ao das páginas legais */}
      <header className="site-header" style={{ borderBottom: '1px solid var(--border)' }}>
        <Link to="/" className="back-arrow" aria-label="Voltar ao início">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 18l-6-6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
        <div style={{ height: 56 }}></div>
      </header>

      <main className="min-h-[60vh] grid place-items-center">
        <div className="grid gap-6 md:gap-8 text-center w-full max-w-2xl">
          {/* Espaço para imagem 404 personalizada (sem borda, sem fundo) */}
          <img
            src="/assets/images/errors/404.png"
            alt="Página não encontrada"
            className="mx-auto w-full max-w-md h-auto object-contain"
            loading="lazy"
          />

          <div className="grid gap-2">
            <h2 className="font-semibold text-text text-xl md:text-2xl">Página não encontrada</h2>
            <p className="text-text/70 max-w-prose mx-auto">
              A página que você procura não existe ou mudou de endereço.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch justify-center gap-3 md:gap-4">
            <Button
              variant="primary"
              className="py-3 w-full sm:w-auto"
              onClick={() => navigate('/')}
            >
              Voltar para o início
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

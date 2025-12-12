import { useEffect } from 'react'
import LoginForm from '@barber/features/auth/components/LoginForm'

export default function Login() {
  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
  }, []);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between p-4 sm:p-6">
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="w-full max-w-md">
          {/* Logo e Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/images/logos/logo.png" 
                alt="Régua Máxima" 
                className="w-[140px] sm:w-[160px] h-auto"
              />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl text-gold mb-2 tracking-wide">
              Dashboard Barbeiro
            </h1>
            <p className="text-text-dim text-sm sm:text-base">
              Acesse o painel administrativo da sua barbearia
            </p>
          </div>

          {/* Card de Login */}
          <div className="card hover-lift animate-fade-in-delayed">
            <h2 className="text-xl font-semibold mb-6 text-center">Fazer Login</h2>
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-sm text-muted animate-fade-in-delayed">
        <p>© Régua Máxima {new Date().getFullYear() + 1}</p>
      </div>
    </div>
  )
}

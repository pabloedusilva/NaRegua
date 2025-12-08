import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '@barber/components/ui/Input'
import Button from '@barber/components/ui/Button'

export default function LoginForm() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Backend integration - Replace with actual authentication API call
    // For now, any input redirects to dashboard (demo mode)
    localStorage.setItem('barber_auth_demo', 'true')
    if (rememberMe) {
      localStorage.setItem('barber_remember', 'true')
    }
    navigate('/admin/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <Input
        label="Telefone"
        type="tel"
        placeholder="(00) 00000-0000"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <div className="relative">
        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[34px] text-text-dim hover:text-text transition-colors"
          aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-border bg-[#131313] text-gold focus:ring-2 focus:ring-gold/60"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <span className="text-text-dim">Lembrar de mim</span>
        </label>
        <a href="#" className="text-gold hover:text-gold-600 transition-colors">
          Esqueceu a senha?
        </a>
      </div>

      <Button type="submit" className="w-full mt-2">
        Entrar
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted mt-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Acesso restrito</span>
      </div>
    </form>
  )
}

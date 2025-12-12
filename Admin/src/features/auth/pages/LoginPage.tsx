import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/app/providers/ToastProvider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulação de login - apenas para desenvolvimento
      if (email && password) {
        const mockUser = {
          id: '1',
          name: 'Admin',
          email: email,
          role: 'super_admin' as const,
          avatar: '/assets/images/profile/profile1.jpg'
        }
        const mockToken = 'mock-admin-token-' + Date.now()

        localStorage.setItem('admin_user', JSON.stringify(mockUser))
        localStorage.setItem('admin_token', mockToken)

        showToast('Login realizado com sucesso!', 'success')
        
        // Recarrega a página para atualizar o contexto de autenticação
        window.location.href = '/admin/dashboard'
      } else {
        showToast('Preencha todos os campos', 'error')
      }
    } catch (error) {
      showToast('Erro ao fazer login', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="card">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-gold mb-2">
              Régua Máxima
            </h1>
            <p className="text-text-dim">
              Painel Administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text/90 mb-2">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text/90 mb-2">
                Senha
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-text-dim">
            <p>Para desenvolvimento: qualquer email/senha funciona</p>
          </div>
        </div>
      </div>
    </div>
  )
}

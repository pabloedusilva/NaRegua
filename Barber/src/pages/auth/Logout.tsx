import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Régua Máxima | Dashboard Barbeiro';
    // TODO: Backend integration - Call logout API
    localStorage.removeItem('barber_auth_demo')
    localStorage.removeItem('barber_remember')
    navigate('/admin/login')
  }, [navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-dim">Saindo...</p>
      </div>
    </div>
  )
}

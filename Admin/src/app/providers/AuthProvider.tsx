import { createContext, ReactNode, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'support'
  avatar?: string
}

interface AuthContextData {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user')
    const storedToken = localStorage.getItem('admin_token')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('admin_user')
    localStorage.removeItem('admin_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

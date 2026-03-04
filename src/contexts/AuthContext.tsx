import { createContext, useContext, useState, type ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithProvider: (provider: 'google' | 'github' | 'microsoft') => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, _password: string) => {
    // Simulate API call
    await new Promise((res) => setTimeout(res, 800))
    setUser({
      id: '1',
      name: email.split('@')[0].replace(/[._]/g, ' '),
      email,
      role: 'Administrator',
    })
  }

  const loginWithProvider = async (provider: 'google' | 'github' | 'microsoft') => {
    await new Promise((res) => setTimeout(res, 800))
    setUser({
      id: '2',
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      email: `user@${provider}.com`,
      role: 'User',
    })
  }

  const register = async (name: string, email: string, _password: string) => {
    // Simulate API call
    await new Promise((res) => setTimeout(res, 800))
    setUser({
      id: String(Date.now()),
      name,
      email,
      role: 'User',
    })
  }

  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginWithProvider, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

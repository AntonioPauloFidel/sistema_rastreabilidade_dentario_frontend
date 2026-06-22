import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth/auth.service'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    authService.me()
      .then((res) => setUsuario(res.data))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false))
  }, [])

  const login = useCallback(async (email, senha) => {
    const res = await authService.login({ email, senha })
    setUsuario(res.data.usuario)
    return res.data
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } finally {
      setUsuario(null)
    }
  }, [])

  const estaAutenticado = !!usuario

  return (
    <AuthContext.Provider value={{ usuario, carregando, estaAutenticado, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return ctx
}

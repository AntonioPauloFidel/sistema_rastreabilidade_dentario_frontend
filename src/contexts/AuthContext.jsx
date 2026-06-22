import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/auth.service'
import logoPng from '../assets/Logo.png'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const verificarAuth = async () => {
      try {
        const res = await authService.me()
        setUsuario(res.data)
      } catch {
        setUsuario(null)
      }
      // Delay mínimo para o splash aparecer (1200ms)
      await new Promise(resolve => setTimeout(resolve, 1200))
      setCarregando(false)
    }

    verificarAuth()
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

  // Mostrar splash enquanto verifica autenticação na raiz
  if (carregando) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100vh',
          backgroundColor: '#038C5A',
          margin: 0,
          padding: 0,
        }}
      >
        <img
          src={logoPng}
          alt="Splash"
          style={{
            maxWidth: '400px',
            maxHeight: '400px',
            animation: 'fadeInOut 1.2s ease-in-out infinite',
          }}
        />
        <style>{`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    )
  }

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

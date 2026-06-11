import { createContext, useContext } from 'react'
import { App } from 'antd'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const { message } = App.useApp()

  const mostrarSucesso = (texto) => message.success(texto, 4)
  const mostrarErro = (texto) => message.error(texto, 4)
  const mostrarAviso = (texto) => message.warning(texto, 4)

  return (
    <ToastContext.Provider value={{ mostrarSucesso, mostrarErro, mostrarAviso }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro do ToastProvider')
  return ctx
}

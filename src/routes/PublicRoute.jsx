import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components/Loading'

export function PublicRoute() {
  const { estaAutenticado, carregando } = useAuth()

  if (carregando) return <Loading fullscreen />
  if (estaAutenticado) return <Navigate to="/home" replace />

  return <Outlet />
}

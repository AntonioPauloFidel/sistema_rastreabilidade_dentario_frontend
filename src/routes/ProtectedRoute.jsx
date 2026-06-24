import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components/Loading'

export function ProtectedRoute() {
  const { estaAutenticado, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <Loading fullscreen />
  if (!estaAutenticado) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}

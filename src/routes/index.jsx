import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components/Loading'
import { LayoutAutenticado } from '../layouts/LayoutAutenticado'
import { LayoutPublico } from '../layouts/LayoutPublico'
import NaoEncontrado from '../pages/NaoEncontrado'

function ProtectedRoute() {
  const { estaAutenticado, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <Loading fullscreen />
  if (!estaAutenticado) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}

function PublicRoute() {
  const { estaAutenticado, carregando } = useAuth()

  if (carregando) return <Loading fullscreen />
  if (estaAutenticado) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route element={<PublicRoute />}>
          <Route element={<LayoutPublico />}>
            <Route path="/login" element={<div>Login</div>} />
            <Route path="/consulta" element={<div>Consulta pública</div>} />
          </Route>
        </Route>

        {/* Rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutAutenticado />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/dentes" element={<div>Dentes</div>} />
            <Route path="/dentes/:id" element={<div>Detalhe do dente</div>} />
            <Route path="/doadores" element={<div>Doadores</div>} />
            <Route path="/remessas" element={<div>Remessas</div>} />
            <Route path="/solicitacoes" element={<div>Solicitações</div>} />
            <Route path="/cessoes" element={<div>Cessões</div>} />
            <Route path="/instituicoes" element={<div>Instituições</div>} />
            <Route path="/clinicas" element={<div>Clínicas</div>} />
            <Route path="/dentistas" element={<div>Dentistas</div>} />
            <Route path="/locais" element={<div>Locais</div>} />
            <Route path="/usuarios" element={<div>Usuários</div>} />
            <Route path="/auditoria" element={<div>Auditoria</div>} />
            <Route path="/perfil" element={<div>Perfil</div>} />
          </Route>
        </Route>

        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  )
}

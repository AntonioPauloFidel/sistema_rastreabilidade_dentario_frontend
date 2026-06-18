import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LayoutAutenticado } from '../layouts/LayoutAutenticado'
import { LayoutPublico } from '../layouts/LayoutPublico'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import NaoEncontrado from '../pages/NaoEncontrado'
import Login from '../pages/Login'

// Módulos — pages/modules/* → herdam Navbar + Footer via LayoutAutenticado
import Dashboard from '../pages/modules/home'

// ─── Rotas públicas ───────────────────────────────────────────────────────────
// Acessíveis sem login. Se já estiver autenticado, redireciona ao /dashboard.
const rotasPublicas = (
  <Route element={<PublicRoute />}>
    <Route element={<LayoutPublico />}>
      <Route path="/login" element={<Login />} />
      <Route path="/consulta" element={<div>Consulta pública</div>} />
    </Route>
  </Route>
)

// ─── Rotas protegidas ─────────────────────────────────────────────────────────
// Exigem autenticação. Se não estiver logado, redireciona ao /login.
const rotasProtegidas = (
  <Route element={<ProtectedRoute />}>
    <Route element={<LayoutAutenticado />}>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Dashboard />} />
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
)

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {rotasPublicas}
        {rotasProtegidas}
        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  )
}

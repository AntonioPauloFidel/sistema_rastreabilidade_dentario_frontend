import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LayoutAutenticado } from '../layouts/LayoutAutenticado'
import { LayoutPublico } from '../layouts/LayoutPublico'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import NaoEncontrado from '../pages/NaoEncontrado'
import Login from '../pages/Login'
import Consulta from '../pages/Consulta'

// Módulos — pages/modules/* → herdam Navbar + Footer via LayoutAutenticado
import Dashboard from '../pages/modules/home'
import Dentes from '../pages/modules/dentes'
import DenteDetalhe from '../pages/modules/denteDetalhe'
import Solicitacoes from '../pages/modules/solicitacoes'
import Cessoes from '../pages/modules/cessoes'
import Clinicas from '../pages/modules/clinicas'
import Dentistas from '../pages/modules/dentistas'
import Doadores from '../pages/modules/doadores'
import Remessas from '../pages/modules/remessas'
import Instituicoes from '../pages/modules/instituicoes'
import Locais from '../pages/modules/locais'
import Usuarios from '../pages/modules/usuarios'
import Auditoria from '../pages/modules/auditoria'
import Perfil from '../pages/modules/perfil'

// ─── Rotas públicas ───────────────────────────────────────────────────────────
// Acessíveis sem login. Se já estiver autenticado, redireciona ao /dashboard.
const rotasPublicas = (
  <Route element={<PublicRoute />}>
    <Route element={<LayoutPublico />}>
      <Route path="/login" element={<Login />} />
      <Route path="/consulta" element={<Consulta />} />
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
      <Route path="/dentes" element={<Dentes />} />
      <Route path="/dentes/:id" element={<DenteDetalhe />} />
      <Route path="/doadores" element={<Doadores />} />
      <Route path="/remessas" element={<Remessas />} />
      <Route path="/solicitacoes" element={<Solicitacoes />} />
      <Route path="/cessoes" element={<Cessoes />} />
      <Route path="/instituicoes" element={<Instituicoes />} />
      <Route path="/clinicas" element={<Clinicas />} />
      <Route path="/dentistas" element={<Dentistas />} />
      <Route path="/locais" element={<Locais />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/auditoria" element={<Auditoria />} />
      <Route path="/perfil" element={<Perfil />} />
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

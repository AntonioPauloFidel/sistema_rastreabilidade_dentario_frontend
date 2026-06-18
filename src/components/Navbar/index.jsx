import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  ExperimentOutlined,
  HeartOutlined,
  SendOutlined,
  FileTextOutlined,
  SwapOutlined,
  BankOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  AuditOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import dentePng from '../../assets/dente.png'
import styles from './styles.module.css'

const itens = [
  { path: '/dashboard',    label: 'Dashboard',    icon: <DashboardOutlined /> },
  { path: '/dentes',       label: 'Dentes',       icon: <ExperimentOutlined /> },
  { path: '/doadores',     label: 'Doadores',     icon: <HeartOutlined /> },
  { path: '/remessas',     label: 'Remessas',     icon: <SendOutlined /> },
  { path: '/solicitacoes', label: 'Solicitações', icon: <FileTextOutlined /> },
  { path: '/cessoes',      label: 'Cessões',      icon: <SwapOutlined /> },
  { path: '/instituicoes', label: 'Instituições', icon: <BankOutlined /> },
  { path: '/clinicas',     label: 'Clínicas',     icon: <MedicineBoxOutlined /> },
  { path: '/dentistas',    label: 'Dentistas',    icon: <UserOutlined /> },
  { path: '/locais',       label: 'Locais',       icon: <EnvironmentOutlined /> },
  { path: '/usuarios',     label: 'Usuários',     icon: <TeamOutlined /> },
  { path: '/auditoria',    label: 'Auditoria',    icon: <AuditOutlined /> },
]

export function Navbar() {
  const [collapsed, setCollapsed] = useState(false)
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const iniciais = usuario?.nome
    ? usuario.nome.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <img src={dentePng} alt="Sirde" className={styles.logoIcon} />
        {!collapsed && <span className={styles.logoText}>Sirde</span>}
      </div>

      {/* Toggle */}
      <button className={styles.toggleBtn} onClick={() => setCollapsed(c => !c)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      {/* Menu */}
      <nav className={styles.nav}>
        {itens.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `${styles.item} ${isActive ? styles.active : ''}`
            }
            title={collapsed ? label : undefined}
          >
            <span className={styles.itemIcon}>{icon}</span>
            {!collapsed && <span className={styles.itemLabel}>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Perfil + logout */}
      <div className={styles.footer}>
        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            `${styles.perfil} ${isActive ? styles.active : ''}`
          }
          title={collapsed ? 'Perfil' : undefined}
        >
          <div className={styles.avatar}>{iniciais}</div>
          {!collapsed && (
            <div className={styles.perfilInfo}>
              <span className={styles.perfilNome}>{usuario?.nome ?? 'Usuário'}</span>
              <span className={styles.perfilEmail}>{usuario?.email ?? ''}</span>
            </div>
          )}
        </NavLink>

        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          title="Sair"
        >
          <LogoutOutlined />
        </button>
      </div>
    </aside>
  )
}

import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  DashboardOutlined,
  HomeOutlined,
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
import { usePermissao } from '../../hooks/usePermissao'
import dentePng from '../../assets/Logo.png'
import styles from './styles.module.css'

const GESTAO = ['ADMIN', 'BIOBANCO_GESTOR']
const OPERACAO = ['ADMIN', 'BIOBANCO_GESTOR', 'BIOBANCO_OPERADOR']

function ToothIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      <path d="M9.19807 4.45825C8.55418 4.22291 7.94427 4 7 4C5 4 4 6 4 8.5C4 10.0985 4.40885 11.0838 4.83441 12.1093C5.0744 12.6877 5.31971 13.2788 5.5 14C5.649 14.596 5.7092 15.4584 5.77321 16.3755C5.92401 18.536 6.096 21 7.5 21C8.39898 21 8.79286 19.5857 9.22652 18.0286C9.75765 16.1214 10.3485 14 12 14C13.6515 14 14.2423 16.1214 14.7735 18.0286C15.2071 19.5857 15.601 21 16.5 21C17.904 21 18.076 18.536 18.2268 16.3755C18.2908 15.4584 18.351 14.596 18.5 14C18.6803 13.2788 18.9256 12.6877 19.1656 12.1093C19.5912 11.0838 20 10.0985 20 8.5C20 6 19 4 17 4C16.0557 4 15.4458 4.22291 14.8019 4.45825C14.082 4.72136 13.3197 5 12 5C10.6803 5 9.91796 4.72136 9.19807 4.45825Z" />
    </svg>
  )
}

const itens = [
  { path: '/home',         label: 'Inicio',       icon: <HomeOutlined />,       perfis: [] },
  { path: '/dentes',       label: 'Dentes',       icon: <ToothIcon />,          perfis: OPERACAO },
  { path: '/doadores',     label: 'Doadores',     icon: <HeartOutlined />,      perfis: OPERACAO },
  { path: '/remessas',     label: 'Remessas',     icon: <SendOutlined />,       perfis: OPERACAO },
  { path: '/solicitacoes', label: 'Solicitações', icon: <FileTextOutlined />,   perfis: [] },
  { path: '/cessoes',      label: 'Cessões',      icon: <SwapOutlined />,       perfis: GESTAO },
  { path: '/instituicoes', label: 'Instituições', icon: <BankOutlined />,       perfis: GESTAO },
  { path: '/clinicas',     label: 'Clínicas',     icon: <MedicineBoxOutlined />, perfis: GESTAO },
  { path: '/dentistas',    label: 'Dentistas',    icon: <UserOutlined />,       perfis: GESTAO },
  { path: '/locais',       label: 'Lugares',       icon: <EnvironmentOutlined />, perfis: [] },
  { path: '/usuarios',     label: 'Usuários',     icon: <TeamOutlined />,       perfis: ['ADMIN'] },
  { path: '/auditoria',    label: 'Auditoria',    icon: <AuditOutlined />,      perfis: ['ADMIN', 'BIOBANCO_GESTOR', 'AUDITOR'] },
]

export function Navbar() {
  const [collapsed, setCollapsed] = useState(false)
  const { usuario, logout } = useAuth()
  const { pode } = usePermissao()
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
        {/*{!collapsed && <span className={styles.logoText}>Sirde</span>}*/}
      </div>

      {/* Toggle */}
      <button className={styles.toggleBtn} onClick={() => setCollapsed(c => !c)}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </button>

      {/* Menu */}
      <nav className={styles.nav}>
        {itens
          .filter(({ perfis }) => pode(perfis))
          .map(({ path, label, icon }) => (
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

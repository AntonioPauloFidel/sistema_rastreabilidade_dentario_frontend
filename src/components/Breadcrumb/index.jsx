import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useLocation, Link } from 'react-router-dom'

const rotulos = {
  dashboard: 'Dashboard',
  dentes: 'Dentes',
  doadores: 'Doadores',
  remessas: 'Remessas',
  solicitacoes: 'Solicitações',
  cessoes: 'Cessões',
  instituicoes: 'Instituições',
  clinicas: 'Clínicas',
  dentistas: 'Dentistas',
  locais: 'Locais',
  usuarios: 'Usuários',
  auditoria: 'Auditoria',
  perfil: 'Perfil',
}

export function Breadcrumb() {
  const { pathname } = useLocation()
  const segmentos = pathname.split('/').filter(Boolean)

  const itens = [
    { title: <Link to="/dashboard">Início</Link> },
    ...segmentos.map((seg, idx) => {
      const caminho = '/' + segmentos.slice(0, idx + 1).join('/')
      const rotulo = rotulos[seg] ?? seg
      const ultimo = idx === segmentos.length - 1

      return {
        title: ultimo ? rotulo : <Link to={caminho}>{rotulo}</Link>,
      }
    }),
  ]

  if (segmentos[0] === 'dashboard') return null

  return (
    <AntBreadcrumb
      items={itens}
      style={{ marginBottom: 16, fontSize: 13 }}
    />
  )
}

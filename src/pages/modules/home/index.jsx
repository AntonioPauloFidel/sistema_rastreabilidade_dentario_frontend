import { useEffect, useState } from 'react'
import { Skeleton, Alert, Table, Tag } from 'antd'
import {
  ExperimentOutlined,
  HeartOutlined,
  SendOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { DashboardCard } from '../../../components/DashboardCard'
import { dashboardService } from '../../../services/dashboard/dashboard.service'
import { useAuth } from '../../../hooks/useAuth'
import styles from './styles.module.css'

const saudacao = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const DATA_HOJE = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
})

export default function Home() {
  const { usuario } = useAuth()
  const [metricas, setMetricas] = useState(null)
  const [grafico, setGrafico] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    Promise.all([
      dashboardService.metricas(),
      dashboardService.graficoStatus(),
    ])
      .then(([resMetricas, resGrafico]) => {
        setMetricas(resMetricas.data)
        setGrafico(resGrafico.data ?? [])
      })
      .catch(() => setErro('Não foi possível carregar os dados do dashboard.'))
      .finally(() => setCarregando(false))
  }, [])

  const primeiroNome = usuario?.nome?.split(' ')[0] ?? 'Usuário'

  const cards = [
    {
      titulo: 'Total de Dentes',
      valor: metricas?.totalDentes ?? 0,
      icone: <ExperimentOutlined />,
      variacao: metricas?.variacaoDentes,
      cor: 'verde',
    },
    {
      titulo: 'Doadores Ativos',
      valor: metricas?.totalDoadores ?? 0,
      icone: <HeartOutlined />,
      variacao: metricas?.variacaoDoadores,
      cor: 'accent',
    },
    {
      titulo: 'Remessas',
      valor: metricas?.totalRemessas ?? 0,
      icone: <SendOutlined />,
      variacao: metricas?.variacaoRemessas,
      cor: 'amarelo',
    },
    {
      titulo: 'Solicitações Pendentes',
      valor: metricas?.solicitacoesPendentes ?? 0,
      icone: <FileTextOutlined />,
      variacao: metricas?.variacaoSolicitacoes,
      cor: 'vermelho',
    },
  ]

  const colunas = [
    { title: 'Status', dataIndex: 'status', key: 'status',
      render: (s) => {
        const map = {
          disponivel:  { color: '#038C5A', label: 'Disponível' },
          reservado:   { color: '#d97706', label: 'Reservado' },
          cedido:      { color: '#6366f1', label: 'Cedido' },
          descartado:  { color: '#dc2626', label: 'Descartado' },
        }
        const cfg = map[s] ?? { color: '#6b7280', label: s }
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    { title: 'Quantidade', dataIndex: 'quantidade', key: 'quantidade', align: 'right' },
    { title: '%', dataIndex: 'percentual', key: 'percentual', align: 'right',
      render: (v) => v != null ? `${v}%` : '—',
    },
  ]

  return (
    <div className={styles.page}>
      {/* Cabeçalho */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.titulo}>
            {saudacao()}, <span className={styles.nome}>{primeiroNome}</span> 👋
          </h1>
          <p className={styles.data}>{DATA_HOJE}</p>
        </div>
      </div>

      {erro && <Alert type="error" showIcon style={{ marginBottom: 24 }}>{erro}</Alert>}

      {/* Cards de métricas */}
      <div className={styles.cards}>
        {cards.map((c) =>
          carregando ? (
            <Skeleton.Button key={c.titulo} active block style={{ height: 110, borderRadius: 8 }} />
          ) : (
            <DashboardCard key={c.titulo} {...c} />
          )
        )}
      </div>

      {/* Tabela de distribuição por status */}
      <div className={styles.secao}>
        <h2 className={styles.secaoTitulo}>Distribuição por Status</h2>
        <Table
          dataSource={grafico}
          columns={colunas}
          rowKey="status"
          loading={carregando}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  )
}

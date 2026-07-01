import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Skeleton, Alert, Tag, Timeline } from 'antd'
import {
  FileTextOutlined,
  SendOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { DashboardCard } from '../../../components/DashboardCard'

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
import { GraficoPizza } from '../../../components/Charts/GraficoPizza'
import { GraficoBarras } from '../../../components/Charts/GraficoBarras'
import { GraficoLinha } from '../../../components/Charts/GraficoLinha'
import { dashboardService } from '../../../services/dashboard/dashboard.service'
import { auditoriaService } from '../../../services/auditoria/auditoria.service'
import { useAuth } from '../../../hooks/useAuth'
import styles from './styles.module.css'

const PERFIS_AUDITORIA = ['ADMIN', 'AUDITOR', 'BIOBANCO_GESTOR']

const saudacao = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const DATA_HOJE = new Date().toLocaleDateString('pt-BR', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
})

function formatarData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function Home() {
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [resumo, setResumo] = useState(null)
  const [auditoria, setAuditoria] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoAuditoria, setCarregandoAuditoria] = useState(false)
  const [erro, setErro] = useState(null)

  const podeVerAuditoria = PERFIS_AUDITORIA.includes(usuario?.perfil)

  useEffect(() => {
    async function carregar() {
      try {
        const res = await dashboardService.resumo()
        setResumo(res.data?.resumo ?? res.data ?? null)
      } catch {
        setErro('Não foi possível carregar os dados do dashboard.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])


  useEffect(() => {
    if (!podeVerAuditoria) return
    setCarregandoAuditoria(true)
    auditoriaService.listar({ page: 1, limit: 5 })
      .then((res) => setAuditoria(res.data?.data ?? []))
      .catch(() => {})
      .finally(() => setCarregandoAuditoria(false))
  }, [podeVerAuditoria])

  const primeiroNome = usuario?.nome?.split(' ')[0] ?? 'Usuário'

  const dadosGraficoStatus = Object.entries(resumo?.dentes?.por_status ?? {}).map(([status, valor]) => ({ status, valor }))

  const dadosGraficoTipo = [
    { tipo: 'Pendentes', valor: resumo?.solicitacoes?.pendentes ?? 0 },
    { tipo: 'Aprovadas', valor: resumo?.solicitacoes?.aprovadas ?? 0 },
    { tipo: 'Recusadas', valor: resumo?.solicitacoes?.recusadas ?? 0 },
  ]

  const dadosGraficoMensal = [
    { mes: 'Total', valor: resumo?.remessas?.total ?? 0 },
    { mes: 'Último mês', valor: resumo?.remessas?.ultimo_mes ?? 0 },
  ]

  const cards = [
    {
      titulo: 'Total de Dentes',
      valor: resumo?.dentes?.total ?? 0,
      icone: <ToothIcon />,
      cor: 'verde',
    },
    {
      titulo: 'Solicitações Pendentes',
      valor: resumo?.solicitacoes?.pendentes ?? 0,
      icone: <FileTextOutlined />,
      cor: 'vermelho',
    },
    {
      titulo: 'Remessas este mês',
      valor: resumo?.remessas?.ultimo_mes ?? 0,
      icone: <SendOutlined />,
      cor: 'amarelo',
    },
    {
      titulo: 'Clínicas Ativas',
      valor: resumo?.clinicas_ativas ?? 0,
      icone: <MedicineBoxOutlined />,
      cor: 'accent',
    },
  ]

  const acoesRapidas = [
    { label: 'Novo Dente',       path: '/dentes',       cor: '#038C5A' },
    { label: 'Nova Remessa',     path: '/remessas',     cor: '#d97706' },
    { label: 'Nova Solicitação', path: '/solicitacoes', cor: '#6366f1' },
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
          carregando
            ? <Skeleton.Button key={c.titulo} active block style={{ height: 110, borderRadius: 8 }} />
            : <DashboardCard key={c.titulo} {...c} />
        )}
      </div>

      {/* Gráficos */}
      <div className={styles.graficosGrid}>
        <GraficoPizza
          dados={dadosGraficoStatus}
          cores={{
            ATIVO: '#038C5A',
            INATIVO: '#05F29B',
            ARMAZENADO: '#0EA5E9',
            CEDIDO: '#F59E0B',
            EM_TRIAGEM: '#8B5CF6',
          }}
          altura={300}
          titulo="Dentes por status"
          carregando={carregando}
        />
        <GraficoBarras
          dados={dadosGraficoTipo}
          cores={{
            Pendentes: '#dc2626',
            Aprovadas: '#059669',
            Recusadas: '#d97706',
          }}
          altura={300}
          titulo="Solicitações por status"
          carregando={carregando}
        />
        <div className={styles.graficoLinhaWrapper}>
          <GraficoLinha
            dados={dadosGraficoMensal}
            altura={300}
            titulo="Remessas"
            carregando={carregando}
          />
        </div>
      </div>

      {/* Ações rápidas + Atividade recente */}
      <div className={styles.grid}>

        {/* Ações rápidas */}
        <div className={styles.secao}>
          <h2 className={styles.secaoTitulo}>
            <PlusOutlined style={{ marginRight: 8, color: '#038C5A' }} />
            Ações rápidas
          </h2>
          <div className={styles.acoes}>
            {acoesRapidas.map(({ label, path, cor }) => (
              <button
                key={path}
                className={styles.acaoBotao}
                style={{ borderColor: cor, color: cor }}
                onClick={() => navigate(path)}
              >
                <PlusOutlined />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Atividade recente — só para perfis com acesso */}
        {podeVerAuditoria && (
          <div className={styles.secao}>
            <h2 className={styles.secaoTitulo}>
              <HistoryOutlined style={{ marginRight: 8, color: '#038C5A' }} />
              Atividade recente
            </h2>

            {carregandoAuditoria ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : auditoria.length === 0 ? (
              <p className={styles.vazio}>Nenhuma atividade registrada.</p>
            ) : (
              <Timeline
                items={auditoria.map((ev) => ({
                  color: '#038C5A',
                  children: (
                    <div className={styles.eventoAuditoria}>
                      <span className={styles.eventoAcao}>
                        <Tag color="green">{ev.acao ?? ev.entidade ?? '—'}</Tag>
                        {ev.descricao ?? ev.detalhes ?? ''}
                      </span>
                      <span className={styles.eventoData}>
                        {formatarData(ev.criadoEm ?? ev.createdAt)}
                      </span>
                    </div>
                  ),
                }))}
              />
            )}
          </div>
        )}

      </div>
    </div>
  )
}

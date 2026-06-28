import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Skeleton, Alert, Tag, Timeline } from 'antd'
import {
  ExperimentOutlined,
  FileTextOutlined,
  SendOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { DashboardCard } from '../../../components/DashboardCard'
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
  const [dadosGraficoStatus, setDadosGraficoStatus] = useState([])
  const [dadosGraficoTipo, setDadosGraficoTipo] = useState([])
  const [dadosGraficoMensal, setDadosGraficoMensal] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoAuditoria, setCarregandoAuditoria] = useState(false)
  const [carregandoGraficos, setCarregandoGraficos] = useState(true)
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
    async function carregarGraficos() {
      try {
        setCarregandoGraficos(true)
        const [statusRes, tipoRes, mensalRes] = await Promise.all([
          dashboardService.graficoStatus().catch(() => ({ data: [] })),
          dashboardService.graficoTipo?.().catch(() => ({ data: [] })) ?? Promise.resolve({ data: [] }),
          dashboardService.graficoMensal().catch(() => ({ data: [] })),
        ])

        const status = statusRes.data?.data ?? statusRes.data?.dados ?? statusRes.data ?? []
        const tipo = tipoRes.data?.data ?? tipoRes.data?.dados ?? tipoRes.data ?? []
        const mensal = mensalRes.data?.data ?? mensalRes.data?.dados ?? mensalRes.data ?? []

        setDadosGraficoStatus(Array.isArray(status) ? status : [])
        setDadosGraficoTipo(Array.isArray(tipo) ? tipo : [])
        setDadosGraficoMensal(Array.isArray(mensal) ? mensal : [])
      } catch {
        setDadosGraficoStatus([])
        setDadosGraficoTipo([])
        setDadosGraficoMensal([])
      } finally {
        setCarregandoGraficos(false)
      }
    }

    carregarGraficos()
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

  const cards = [
    {
      titulo: 'Total de Dentes',
      valor: resumo?.dentes?.total ?? 0,
      icone: <ExperimentOutlined />,
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
            ARMAZENADO: '#038C5A',
            CEDIDO: '#05F29B',
            EM_TRIAGEM: '#0EA5E9',
            DESCARTADO: '#F59E0B',
            TRANSFERIDO: '#8B5CF6',
          }}
          altura={300}
          titulo="Dentes por status"
          carregando={carregandoGraficos}
        />
        <GraficoBarras
          dados={dadosGraficoTipo}
          cores={{
            MOLAR: '#038C5A',
            INCISIVO: '#05F29B',
            CANINO: '#0EA5E9',
            PREMOLAR: '#F59E0B',
          }}
          altura={300}
          titulo="Dentes por tipo"
          carregando={carregandoGraficos}
        />
        <div className={styles.graficoLinhaWrapper}>
          <GraficoLinha
            dados={dadosGraficoMensal}
            altura={300}
            titulo="Cessões por mês"
            carregando={carregandoGraficos}
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

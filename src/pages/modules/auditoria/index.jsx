import { useEffect, useState } from 'react'
import { Table, Tag, Alert } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { EmptyState } from '../../../components/EmptyState'
import { auditoriaService } from '../../../services/auditoria/auditoria.service'
import styles from './styles.module.css'

const LIMIT = 20

const COR_ACAO = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
}

export default function Auditoria() {
  const [eventos, setEventos] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  async function carregar(pagina = page) {
    setCarregando(true)
    setErro(null)
    try {
      const res = await auditoriaService.listar({ page: pagina, limit: LIMIT })
      setEventos(res.data?.data ?? res.data?.eventos ?? [])
      setTotal(res.data?.total ?? 0)
    } catch {
      setErro('Não foi possível carregar o registro de auditoria.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(1)
  }, [])

  const colunas = [
    {
      title: 'Data/Hora',
      key: 'criadoEm',
      render: (_, ev) => {
        const val = ev.criadoEm ?? ev.createdAt ?? ev.data
        return val ? new Date(val).toLocaleString('pt-BR') : '—'
      },
    },
    {
      title: 'Usuário',
      key: 'usuario',
      render: (_, ev) => ev.usuarioNome ?? ev.usuario?.nome ?? ev.usuario ?? '—',
    },
    {
      title: 'Entidade',
      key: 'entidade',
      render: (_, ev) => ev.entidade ?? ev.recurso ?? '—',
    },
    {
      title: 'Ação',
      key: 'acao',
      render: (_, ev) => {
        const acao = ev.acao ?? ev.tipo ?? ev.action ?? '—'
        const cor = COR_ACAO[acao?.toUpperCase()] ?? 'default'
        return <Tag color={cor}>{acao}</Tag>
      },
    },
    {
      title: 'Descrição',
      key: 'descricao',
      render: (_, ev) => ev.descricao ?? ev.detalhes ?? ev.mensagem ?? '—',
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        titulo="Auditoria"
        subtitulo="Registro de todas as ações do sistema"
      />

      {erro && <Alert type="error" showIcon message={erro} style={{ marginBottom: 16 }} />}

      <Table
        rowKey={(ev) => ev.id ?? ev._id ?? Math.random()}
        loading={carregando}
        dataSource={eventos}
        columns={colunas}
        locale={{ emptyText: <EmptyState mensagem="Nenhum registro encontrado" /> }}
        pagination={{
          current: page,
          pageSize: LIMIT,
          total,
          onChange: (p) => { setPage(p); carregar(p) },
          showSizeChanger: false,
        }}
      />
    </div>
  )
}

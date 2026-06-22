import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Table, Tag, Button, Select, Modal, Form, Input, Alert, Space,
} from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { EmptyState } from '../../../components/EmptyState'
import { dentesService } from '../../../services/dentes/dentes.service'
import {
  STATUS_DENTE, TIPO_DENTE, CONDICAO_DENTE, toSelectOptions,
} from '../../../constants/enums'
import styles from './styles.module.css'

const { TextArea } = Input

const STATUS_OPTIONS = toSelectOptions(STATUS_DENTE)
const TIPO_OPTIONS = toSelectOptions(TIPO_DENTE)
const CONDICAO_OPTIONS = toSelectOptions(CONDICAO_DENTE)

export default function Dentes() {
  const navigate = useNavigate()
  const [dentes, setDentes] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const [filtroStatus, setFiltroStatus] = useState(null)
  const [filtroTipo, setFiltroTipo] = useState(null)

  const [modalCriar, setModalCriar] = useState(false)
  const [salvandoCriar, setSalvandoCriar] = useState(false)
  const [formCriar] = Form.useForm()

  const [modalStatus, setModalStatus] = useState(false)
  const [denteAlvo, setDenteAlvo] = useState(null)
  const [salvandoStatus, setSalvandoStatus] = useState(false)
  const [formStatus] = Form.useForm()

  const LIMIT = 20

  async function carregar(pagina = page) {
    setCarregando(true)
    setErro(null)
    try {
      const params = { page: pagina, limit: LIMIT }
      if (filtroStatus) params.status = filtroStatus
      if (filtroTipo) params.tipo = filtroTipo
      const res = await dentesService.listar(params)
      setDentes(res.data?.data ?? res.data?.dentes ?? [])
      setTotal(res.data?.total ?? 0)
    } catch {
      setErro('Não foi possível carregar os dentes.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(1)
    setPage(1)
  }, [filtroStatus, filtroTipo])

  async function handleCriar(valores) {
    setSalvandoCriar(true)
    try {
      await dentesService.criar(valores)
      formCriar.resetFields()
      setModalCriar(false)
      carregar(page)
    } catch {
      // erro tratado sem fechar o modal
    } finally {
      setSalvandoCriar(false)
    }
  }

  function abrirModalStatus(dente) {
    setDenteAlvo(dente)
    formStatus.resetFields()
    setModalStatus(true)
  }

  async function handleAlterarStatus(valores) {
    if (!denteAlvo) return
    setSalvandoStatus(true)
    try {
      await dentesService.alterarStatus(denteAlvo.id, valores)
      setModalStatus(false)
      carregar(page)
    } catch {
      // erro tratado sem fechar o modal
    } finally {
      setSalvandoStatus(false)
    }
  }

  const colunas = [
    {
      title: 'Código Rastreio',
      dataIndex: 'codigoRastreio',
      key: 'codigoRastreio',
      render: (cod, rec) => <Link to={`/dentes/${rec.id}`}>{cod ?? rec.id}</Link>,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (v) => TIPO_DENTE[v]?.label ?? v ?? '—',
    },
    {
      title: 'Condição',
      dataIndex: 'condicao',
      key: 'condicao',
      render: (v) => CONDICAO_DENTE[v]?.label ?? v ?? '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => {
        const cfg = STATUS_DENTE[v]
        return cfg ? <Tag color={cfg.cor}>{cfg.label}</Tag> : <Tag>{v ?? '—'}</Tag>
      },
    },
    {
      title: 'Doador',
      dataIndex: 'doador',
      key: 'doador',
      render: (v) => v?.nome ?? v ?? '—',
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/dentes/${rec.id}`)}>Ver</Button>
          <Button size="small" onClick={() => abrirModalStatus(rec)}>Status</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        titulo="Dentes"
        acaoPrincipal={{ label: '+ Novo Dente', onClick: () => setModalCriar(true) }}
      />

      <div className={styles.filtros}>
        <Select
          placeholder="Filtrar por status"
          options={STATUS_OPTIONS}
          value={filtroStatus}
          onChange={setFiltroStatus}
          allowClear
          style={{ width: 200 }}
        />
        <Select
          placeholder="Filtrar por tipo"
          options={TIPO_OPTIONS}
          value={filtroTipo}
          onChange={setFiltroTipo}
          allowClear
          style={{ width: 200 }}
        />
        <Button
          onClick={() => { setFiltroStatus(null); setFiltroTipo(null) }}
          disabled={!filtroStatus && !filtroTipo}
        >
          Limpar
        </Button>
      </div>

      {erro && <Alert type="error" showIcon message={erro} style={{ marginBottom: 16 }} />}

      <Table
        rowKey="id"
        loading={carregando}
        dataSource={dentes}
        columns={colunas}
        locale={{ emptyText: <EmptyState mensagem="Nenhum dente encontrado" /> }}
        pagination={{
          current: page,
          pageSize: LIMIT,
          total,
          onChange: (p) => { setPage(p); carregar(p) },
          showSizeChanger: false,
        }}
      />

      <Modal
        title="Novo Dente"
        open={modalCriar}
        onCancel={() => { setModalCriar(false); formCriar.resetFields() }}
        onOk={() => formCriar.submit()}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={salvandoCriar}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={formCriar} layout="vertical" onFinish={handleCriar}>
          <Form.Item name="codigoRastreio" label="Código de Rastreio">
            <Input />
          </Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Selecione o tipo' }]}>
            <Select options={TIPO_OPTIONS} placeholder="Selecione" />
          </Form.Item>
          <Form.Item name="condicao" label="Condição" rules={[{ required: true, message: 'Selecione a condição' }]}>
            <Select options={CONDICAO_OPTIONS} placeholder="Selecione" />
          </Form.Item>
          <Form.Item name="doadorId" label="ID do Doador">
            <Input />
          </Form.Item>
          <Form.Item name="remessaId" label="ID da Remessa">
            <Input />
          </Form.Item>
          <Form.Item name="localAtualId" label="ID do Local Atual">
            <Input />
          </Form.Item>
          <Form.Item name="observacao" label="Observação">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Alterar Status"
        open={modalStatus}
        onCancel={() => { setModalStatus(false); formStatus.resetFields() }}
        onOk={() => formStatus.submit()}
        okText="Confirmar"
        cancelText="Cancelar"
        confirmLoading={salvandoStatus}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={formStatus} layout="vertical" onFinish={handleAlterarStatus}>
          <Form.Item name="statusNovo" label="Novo Status" rules={[{ required: true, message: 'Selecione o novo status' }]}>
            <Select options={STATUS_OPTIONS} placeholder="Selecione" />
          </Form.Item>
          <Form.Item name="motivo" label="Motivo" rules={[{ required: true, message: 'Informe o motivo' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="observacao" label="Observação">
            <TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

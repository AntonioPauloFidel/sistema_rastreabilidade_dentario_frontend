import { useEffect, useState } from 'react'
import {
  Table, Tag, Button, Modal, Form, Input, InputNumber, message, Space,
} from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { PageHeader } from '../../../components/PageHeader'
import { solicitacoesService } from '../../../services/solicitacoes/solicitacoes.service'
import { instituicoesService } from '../../../services/instituicoes/instituicoes.service'
import { STATUS_SOLICITACAO, FINALIDADE, TIPO_DENTE, toSelectOptions } from '../../../constants/enums'
import { Select as CustomSelect } from '../../../components/Select'
import styles from './styles.module.css'

const { TextArea } = Input

const STATUS_OPTIONS = [{ value: '', label: 'Todos' }, ...toSelectOptions(STATUS_SOLICITACAO)]
const FINALIDADE_OPTIONS = toSelectOptions(FINALIDADE)
const TIPO_DENTE_OPTIONS = toSelectOptions(TIPO_DENTE)

function formatarData(iso) {
  if (!iso) return '—'
  return dayjs(iso).format('DD/MM/YYYY')
}

export default function Solicitacoes() {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('')
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [total, setTotal] = useState(0)

  // Modal nova solicitação
  const [modalNovaAberto, setModalNovaAberto] = useState(false)
  const [salvandoNova, setSalvandoNova] = useState(false)
  const [formNova] = Form.useForm()
  const [instituicoes, setInstituicoes] = useState([])
  const [instituicoesCarregando, setInstituicoesCarregando] = useState(false)
  const [temItens, setTemItens] = useState(false)
  const [totalDentes, setTotalDentes] = useState(0)

  // Modal aprovar
  const [modalAprovarAberto, setModalAprovarAberto] = useState(false)
  const [aprovando, setAprovando] = useState(false)
  const [idAprovar, setIdAprovar] = useState(null)
  const [formAprovar] = Form.useForm()

  // Modal recusar
  const [modalRecusarAberto, setModalRecusarAberto] = useState(false)
  const [recusando, setRecusando] = useState(false)
  const [idRecusar, setIdRecusar] = useState(null)
  const [formRecusar] = Form.useForm()

  const carregar = async (pagina = 1, status = filtroStatus) => {
    setCarregando(true)
    try {
      const params = { page: pagina, limit: 10 }
      if (status) params.status = status
      const res = await solicitacoesService.listar(params)
      const payload = res.data
      setDados(payload.data ?? payload ?? [])
      setTotal(payload.total ?? payload.length ?? 0)
    } catch {
      message.error('Erro ao carregar solicitações.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(paginaAtual, filtroStatus)
    carregarInstituicoes()
  }, [])

  const carregarInstituicoes = async () => {
    setInstituicoesCarregando(true)
    try {
      const res = await instituicoesService.listar({ page: 1, limit: 200 })
      const payload = res.data
      setInstituicoes(payload.data ?? payload ?? [])
    } catch {
      message.error('Erro ao carregar instituições.')
    } finally {
      setInstituicoesCarregando(false)
    }
  }

  const handleFiltroStatus = (valor) => {
    setFiltroStatus(valor)
    setPaginaAtual(1)
    carregar(1, valor)
  }

  const handlePagina = (pagina) => {
    setPaginaAtual(pagina)
    carregar(pagina, filtroStatus)
  }

  // ── Nova Solicitação ──────────────────────────────────────────────────────────
  const abrirNova = () => {
    formNova.resetFields()
    setModalNovaAberto(true)
  }

  const confirmarNova = async () => {
    try {
      const valores = await formNova.validateFields()
      setSalvandoNova(true)
      await solicitacoesService.criar(valores)
      message.success('Solicitação criada com sucesso.')
      setModalNovaAberto(false)
      carregar(paginaAtual, filtroStatus)
    } catch (err) {
      if (err?.errorFields) return // erro de validação do form, antd exibe
      message.error('Erro ao criar solicitação.')
    } finally {
      setSalvandoNova(false)
    }
  }

  const handleNovaSolicitacaoChange = (_, allValues) => {
    const itens = allValues.itens || []
    const total = itens.reduce((sum, item) => sum + (Number(item?.quantidade) || 0), 0)
    setTemItens(itens.length > 0)
    setTotalDentes(total)
  }

  // ── Aprovar ───────────────────────────────────────────────────────────────────
  const abrirAprovar = (id) => {
    setIdAprovar(id)
    formAprovar.resetFields()
    setModalAprovarAberto(true)
  }

  const confirmarAprovar = async () => {
    try {
      const valores = await formAprovar.validateFields()
      setAprovando(true)
      await solicitacoesService.aprovar(idAprovar, valores)
      message.success('Solicitação aprovada.')
      setModalAprovarAberto(false)
      carregar(paginaAtual, filtroStatus)
    } catch (err) {
      if (err?.errorFields) return
      message.error('Erro ao aprovar solicitação.')
    } finally {
      setAprovando(false)
    }
  }

  // ── Recusar ───────────────────────────────────────────────────────────────────
  const abrirRecusar = (id) => {
    setIdRecusar(id)
    formRecusar.resetFields()
    setModalRecusarAberto(true)
  }

  const confirmarRecusar = async () => {
    try {
      const valores = await formRecusar.validateFields()
      setRecusando(true)
      await solicitacoesService.recusar(idRecusar, valores.motivo)
      message.success('Solicitação recusada.')
      setModalRecusarAberto(false)
      carregar(paginaAtual, filtroStatus)
    } catch (err) {
      if (err?.errorFields) return
      message.error('Erro ao recusar solicitação.')
    } finally {
      setRecusando(false)
    }
  }

  const colunas = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      render: (id) => (
        <span className={styles.idCurto} title={id}>
          {id ? id.slice(0, 4).toUpperCase() : '—'}
        </span>
      ),
    },
    {
      title: 'Instituição',
      dataIndex: 'instituicaoId',
      key: 'instituicaoId',
      render: (v, row) => row.instituicao?.nome ?? row.nomeInstituicao ?? v ?? '—',
    },
    {
      title: 'Finalidade',
      dataIndex: 'finalidade',
      key: 'finalidade',
      render: (v) => FINALIDADE[v]?.label ?? v ?? '—',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => {
        const cfg = STATUS_SOLICITACAO[v]
        return cfg ? <Tag color={cfg.cor}>{cfg.label}</Tag> : <Tag>{v}</Tag>
      },
    },
    {
      title: 'Data',
      dataIndex: 'criadoEm',
      key: 'criadoEm',
      render: (v) => formatarData(v ?? null),
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 220,
      render: (_, row) => (
        <Space size="small">
          {row.status === 'PENDENTE_ANALISE' && (
            <>
              <Button
                size="small"
                type="primary"
                style={{ background: '#038C5A', borderColor: '#038C5A' }}
                onClick={() => abrirAprovar(row.id)}
              >
                Aprovar
              </Button>
              <Button
                size="small"
                danger
                onClick={() => abrirRecusar(row.id)}
              >
                Recusar
              </Button>
            </>
          )}
          <Button size="small" onClick={() => message.info(`ID: ${row.id}`)}>
            Ver
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        titulo="Solicitações"
        acaoPrincipal={{ label: '+ Nova Solicitação', onClick: abrirNova }}
      />

      {/* Filtro */}
      <div className={styles.filtros}>
        <Select
          value={filtroStatus}
          onChange={handleFiltroStatus}
          options={STATUS_OPTIONS}
          style={{ width: 220 }}
          placeholder="Filtrar por status"
        />
      </div>

      {/* Tabela */}
      <Table
        rowKey="id"
        dataSource={dados}
        columns={colunas}
        loading={carregando}
        pagination={{
          current: paginaAtual,
          total,
          pageSize: 10,
          onChange: handlePagina,
          showSizeChanger: false,
        }}
        className={styles.tabela}
      />

      {/* Modal Nova Solicitação */}
      <Modal
        title="Nova Solicitação"
        open={modalNovaAberto}
        onOk={confirmarNova}
        onCancel={() => setModalNovaAberto(false)}
        confirmLoading={salvandoNova}
        okText="Criar"
        cancelText="Cancelar"
        okButtonProps={{ disabled: !temItens }}
        width={640}
        destroyOnClose
      >
        <Form
          form={formNova}
          layout="vertical"
          style={{ marginTop: 16 }}
          onValuesChange={handleNovaSolicitacaoChange}
        >
          <Form.Item
            name="instituicaoId"
            label="Instituição solicitante"
            rules={[{ required: true, message: 'Informe a instituição solicitante.' }]}
          >
            <CustomSelect
              showSearch
              placeholder="Selecione a instituição"
              loading={instituicoesCarregando}
              opcoes={instituicoes.map((inst) => ({ value: inst.id, label: inst.nome ?? inst.id }))}
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>

          <Form.Item
            name="finalidade"
            label="Finalidade"
            rules={[{ required: true, message: 'Selecione a finalidade.' }]}
          >
            <Select options={FINALIDADE_OPTIONS} placeholder="Selecione a finalidade" />
          </Form.Item>

          <Form.Item
            name="justificativa"
            label="Justificativa"
            rules={[
              { required: true, message: 'Informe a justificativa.' },
              { min: 10, message: 'Mínimo de 10 caracteres.' },
            ]}
          >
            <TextArea rows={3} placeholder="Descreva a justificativa da solicitação" />
          </Form.Item>

          <div className={styles.itensTitulo}>Itens da Solicitação</div>

          <Form.Item shouldUpdate={(prev, cur) => prev.itens !== cur.itens}>
            {() => {
              const itens = formNova.getFieldValue('itens') || []
              const total = itens.reduce((sum, item) => sum + (Number(item?.quantidade) || 0), 0)
              return (
                <div className={styles.totalPreview}>
                  Total de dentes solicitados: <strong>{total}</strong>
                </div>
              )
            }}
          </Form.Item>

          <Form.List
            name="itens"
            rules={[
              {
                validator: async (_, itens) => {
                  if (!itens || itens.length === 0) {
                    return Promise.reject(new Error('Adicione ao menos um item.'))
                  }
                  const tipos = itens.map((item) => item?.tipoDente).filter(Boolean)
                  const duplicados = tipos.some((tipo, index) => tipos.indexOf(tipo) !== index)
                  if (duplicados) {
                    return Promise.reject(new Error('Tipos duplicados não são permitidos.'))
                  }
                },
              },
            ]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className={styles.itemLinha}>
                    <Form.Item
                      {...restField}
                      name={[name, 'tipoDente']}
                      rules={[{ required: true, message: 'Selecione o tipo.' }]}
                      style={{ flex: 2, marginBottom: 0 }}
                    >
                      <CustomSelect opcoes={TIPO_DENTE_OPTIONS} placeholder="Tipo de dente" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'quantidade']}
                      rules={[{ required: true, message: 'Informe a quantidade.' }]}
                      style={{ flex: 1, marginBottom: 0 }}
                    >
                      <InputNumber min={1} placeholder="Qtd." style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'requisitos']}
                      style={{ flex: 2, marginBottom: 0 }}
                    >
                      <Input placeholder="Requisitos (opcional)" />
                    </Form.Item>

                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}

                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    block
                  >
                    Adicionar item
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* Modal Aprovar */}
      <Modal
        title="Aprovar Solicitação"
        open={modalAprovarAberto}
        onOk={confirmarAprovar}
        onCancel={() => setModalAprovarAberto(false)}
        confirmLoading={aprovando}
        okText="Aprovar"
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={formAprovar} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="motivo" label="Motivo (opcional)">
            <TextArea rows={3} placeholder="Informe um motivo ou observação (opcional)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Recusar */}
      <Modal
        title="Recusar Solicitação"
        open={modalRecusarAberto}
        onOk={confirmarRecusar}
        onCancel={() => setModalRecusarAberto(false)}
        confirmLoading={recusando}
        okText="Recusar"
        okButtonProps={{ danger: true }}
        cancelText="Cancelar"
        destroyOnClose
      >
        <Form form={formRecusar} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="motivo"
            label="Motivo"
            rules={[{ required: true, message: 'Informe o motivo da recusa.' }]}
          >
            <TextArea rows={3} placeholder="Informe o motivo da recusa" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

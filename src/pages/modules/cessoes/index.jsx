import { useEffect, useState } from 'react'
import {
  Table, Tag, Button, Modal, Form, Input, DatePicker, message, Space,
} from 'antd'
import dayjs from 'dayjs'
import { PageHeader } from '../../../components/PageHeader'
import { cessoesService } from '../../../services/cessoes/cessoes.service'
import { STATUS_CESSAO } from '../../../constants/enums'
import styles from './styles.module.css'

const { TextArea } = Input

function formatarData(iso) {
  if (!iso) return '—'
  return dayjs(iso).format('DD/MM/YYYY')
}

export default function Cessoes() {
  const [dados, setDados] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)
  const [total, setTotal] = useState(0)

  // Modal nova cessão
  const [modalNovaAberto, setModalNovaAberto] = useState(false)
  const [salvandoNova, setSalvandoNova] = useState(false)
  const [formNova] = Form.useForm()

  const carregar = async (pagina = 1) => {
    setCarregando(true)
    try {
      const res = await cessoesService.listar({ page: pagina, limit: 10 })
      const payload = res.data
      setDados(payload.data ?? payload ?? [])
      setTotal(payload.total ?? payload.length ?? 0)
    } catch {
      message.error('Erro ao carregar cessões.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(paginaAtual)
  }, [])

  const handlePagina = (pagina) => {
    setPaginaAtual(pagina)
    carregar(pagina)
  }

  // ── Encerrar ──────────────────────────────────────────────────────────────────
  const handleEncerrar = (id) => {
    Modal.confirm({
      title: 'Encerrar cessão',
      content: 'Tem certeza que deseja encerrar esta cessão?',
      okText: 'Encerrar',
      okButtonProps: { danger: true },
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await cessoesService.encerrar(id)
          message.success('Cessão encerrada com sucesso.')
          carregar(paginaAtual)
        } catch {
          message.error('Erro ao encerrar cessão.')
        }
      },
    })
  }

  // ── Nova Cessão ───────────────────────────────────────────────────────────────
  const abrirNova = () => {
    formNova.resetFields()
    setModalNovaAberto(true)
  }

  const confirmarNova = async () => {
    try {
      const valores = await formNova.validateFields()
      const payload = {
        ...valores,
        prazoUso: valores.prazoUso ? valores.prazoUso.toISOString() : undefined,
      }
      setSalvandoNova(true)
      await cessoesService.criar(payload)
      message.success('Cessão criada com sucesso.')
      setModalNovaAberto(false)
      carregar(paginaAtual)
    } catch (err) {
      if (err?.errorFields) return
      message.error('Erro ao criar cessão.')
    } finally {
      setSalvandoNova(false)
    }
  }

  const colunas = [
    {
      title: 'Dente',
      dataIndex: 'dente',
      key: 'dente',
      render: (v, row) => v?.codigoRastreio ?? row.codigoRastreio ?? row.denteId?.slice(0, 8) ?? '—',
    },
    {
      title: 'Instituição',
      dataIndex: 'instituicao',
      key: 'instituicao',
      render: (v, row) => v?.nome ?? row.nomeInstituicao ?? row.instituicaoId ?? '—',
    },
    {
      title: 'Solicitação',
      dataIndex: 'solicitacaoId',
      key: 'solicitacaoId',
      render: (v) => (v ? <span className={styles.idCurto}>{v.slice(0, 4).toUpperCase()}</span> : '—'),
    },
    {
      title: 'Prazo de Uso',
      dataIndex: 'prazoUso',
      key: 'prazoUso',
      render: (v) => formatarData(v),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => {
        const cfg = STATUS_CESSAO[v]
        return cfg ? <Tag color={cfg.cor}>{cfg.label}</Tag> : <Tag>{v}</Tag>
      },
    },
    {
      title: 'Ações',
      key: 'acoes',
      width: 120,
      render: (_, row) => (
        <Space size="small">
          {row.status === 'ATIVA' && (
            <Button
              size="small"
              danger
              onClick={() => handleEncerrar(row.id)}
            >
              Encerrar
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        titulo="Cessões"
        acaoPrincipal={{ label: '+ Nova Cessão', onClick: abrirNova }}
      />

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

      {/* Modal Nova Cessão */}
      <Modal
        title="Nova Cessão"
        open={modalNovaAberto}
        onOk={confirmarNova}
        onCancel={() => setModalNovaAberto(false)}
        confirmLoading={salvandoNova}
        okText="Criar"
        cancelText="Cancelar"
        width={560}
        destroyOnClose
      >
        <Form form={formNova} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="solicitacaoId"
            label="ID da Solicitação"
            rules={[{ required: true, message: 'Informe o ID da solicitação.' }]}
          >
            <Input placeholder="UUID da solicitação" />
          </Form.Item>

          <Form.Item
            name="instituicaoId"
            label="ID da Instituição"
            rules={[{ required: true, message: 'Informe o ID da instituição.' }]}
          >
            <Input placeholder="UUID da instituição" />
          </Form.Item>

          <Form.Item
            name="denteId"
            label="ID do Dente"
            rules={[{ required: true, message: 'Informe o ID do dente.' }]}
          >
            <Input placeholder="UUID do dente" />
          </Form.Item>

          <Form.Item
            name="prazoUso"
            label="Prazo de Uso"
            rules={[{ required: true, message: 'Selecione o prazo de uso.' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              placeholder="Selecione a data"
              disabledDate={(d) => d && d.isBefore(dayjs().startOf('day'))}
            />
          </Form.Item>

          <Form.Item name="observacao" label="Observação (opcional)">
            <TextArea rows={3} placeholder="Observações sobre a cessão" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

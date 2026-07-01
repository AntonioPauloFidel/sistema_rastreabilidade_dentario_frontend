import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Card, Tag, Button, Timeline, Alert, Skeleton, Descriptions, Modal, Form, Input, Select,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { dentesService } from '../../../services/dentes/dentes.service'
import QRCodeDente from '../../../components/QRCodeDente'
import {
  STATUS_DENTE, TIPO_DENTE, CONDICAO_DENTE, toSelectOptions,
} from '../../../constants/enums'
import styles from './styles.module.css'

const { TextArea } = Input

const STATUS_OPTIONS = toSelectOptions(STATUS_DENTE)

function formatarData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function DenteDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [dente, setDente] = useState(null)
  const [movimentacoes, setMovimentacoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [carregandoMov, setCarregandoMov] = useState(true)
  const [erro, setErro] = useState(null)

  const [modalStatus, setModalStatus] = useState(false)
  const [salvandoStatus, setSalvandoStatus] = useState(false)
  const [formStatus] = Form.useForm()

  useEffect(() => {
    async function carregar() {
      setCarregando(true)
      setErro(null)
      try {
        const res = await dentesService.buscarPorId(id)
        const payload = res.data
        const dente = Array.isArray(payload)
          ? payload[0]?.dente ?? payload[0]
          : payload?.dente ?? payload?.data ?? payload
        setDente(dente ?? null)
      } catch (err) {
        const mensagem = err.response?.data?.message ?? err.response?.data?.mensagem
        setErro(mensagem ? `Erro ao carregar o dente: ${mensagem}` : 'Não foi possível carregar os dados do dente.')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [id])

  useEffect(() => {
    setCarregandoMov(true)
    dentesService.movimentacoes(id)
      .then((res) => setMovimentacoes(res.data?.data ?? res.data?.movimentacoes ?? res.data ?? []))
      .catch(() => setMovimentacoes([]))
      .finally(() => setCarregandoMov(false))
  }, [id])

  async function handleAlterarStatus(valores) {
    setSalvandoStatus(true)
    try {
      await dentesService.alterarStatus(id, valores)
      setModalStatus(false)
      formStatus.resetFields()
      const res = await dentesService.buscarPorId(id)
      const payload = res.data
      const dente = Array.isArray(payload)
        ? payload[0]?.dente ?? payload[0]
        : payload?.dente ?? payload?.data ?? payload
      setDente(dente ?? null)
      const resMov = await dentesService.movimentacoes(id)
      setMovimentacoes(resMov.data?.data ?? resMov.data?.movimentacoes ?? resMov.data ?? [])
    } catch {
      // erro tratado sem fechar o modal
    } finally {
      setSalvandoStatus(false)
    }
  }

  const statusCfg = dente ? STATUS_DENTE[dente.status] : null

  return (
    <div className={styles.page}>
      <div className={styles.topo}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/dentes')}
          type="text"
          className={styles.btnVoltar}
        >
          Voltar
        </Button>
        {dente && (
          <Button
            type="primary"
            onClick={() => { formStatus.resetFields(); setModalStatus(true) }}
            style={{ background: '#038C5A', borderColor: '#038C5A' }}
          >
            Alterar Status
          </Button>
        )}
      </div>

      {erro && <Alert type="error" showIcon message={erro} style={{ marginBottom: 16 }} />}

      <Card className={styles.card}>
        {carregando ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : dente ? (
          <Descriptions
            title={
              <span className={styles.cardTitulo}>
                Dente — {dente.codigoRastreio ?? dente.id}
              </span>
            }
            bordered
            column={{ xs: 1, sm: 2 }}
          >
            <Descriptions.Item label="Código de Rastreio">
              {dente.codigoRastreio ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Tipo">
              {TIPO_DENTE[dente.tipo]?.label ?? dente.tipo ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Condição">
              {CONDICAO_DENTE[dente.condicao]?.label ?? dente.condicao ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {statusCfg
                ? <Tag color={statusCfg.cor}>{statusCfg.label}</Tag>
                : <Tag>{dente.status ?? '—'}</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Doador">
              {dente.doador?.nome ?? dente.doadorId ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Local Atual">
              {dente.localAtual?.nome ?? dente.localAtualId ?? '—'}
            </Descriptions.Item>
            <Descriptions.Item label="Observação" span={2}>
              {dente.observacao ?? '—'}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Card>

      {dente && (
        <Card title={<span className={styles.cardTitulo}>QR Code do Dente</span>} className={styles.card}>
          <QRCodeDente codigo={dente.codigoRastreio ?? dente.id} tamanho={190} />
        </Card>
      )}

      <Card
        title={<span className={styles.cardTitulo}>Histórico de Movimentações</span>}
        className={styles.card}
      >
        {carregandoMov ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : movimentacoes.length === 0 ? (
          <p className={styles.vazio}>Nenhuma movimentação registrada.</p>
        ) : (
          <Timeline
            items={movimentacoes.map((mov) => {
              const novoStatusCfg = STATUS_DENTE[mov.statusNovo]
              return {
                color: '#038C5A',
                children: (
                  <div className={styles.movItem}>
                    <div className={styles.movStatuses}>
                      <Tag>{STATUS_DENTE[mov.statusAnterior]?.label ?? mov.statusAnterior ?? '—'}</Tag>
                      <span className={styles.seta}>→</span>
                      <Tag color={novoStatusCfg?.cor}>{novoStatusCfg?.label ?? mov.statusNovo ?? '—'}</Tag>
                    </div>
                    {mov.motivo && <p className={styles.movMotivo}>{mov.motivo}</p>}
                    <span className={styles.movData}>{formatarData(mov.criadoEm ?? mov.createdAt)}</span>
                  </div>
                ),
              }
            })}
          />
        )}
      </Card>

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

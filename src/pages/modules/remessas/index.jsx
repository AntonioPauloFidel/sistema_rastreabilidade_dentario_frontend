import { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, message, DatePicker } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { remessasService } from '../../../services/remessas/remessas.service'
import styles from './styles.module.css'

export default function Remessas() {
  const [dados, setDados] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [form] = Form.useForm()

  async function carregar(p = page) {
    setCarregando(true)
    try {
      const res = await remessasService.listar({ page: p, limit: 20 })
      setDados(res.data.data ?? [])
      setTotal(res.data.total ?? 0)
    } catch {
      message.error('Erro ao carregar.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar() }, [page])

  function abrirModal(registro = null) {
    setEditando(registro)
    form.setFieldsValue(registro ?? {})
    setModalAberto(true)
  }

  function fecharModal() {
    setModalAberto(false)
    setEditando(null)
    form.resetFields()
  }

  async function salvar(values) {
    setSalvando(true)
    try {
      const payload = {
        ...values,
        dataEnvio: values.dataEnvio?.toISOString(),
        dataRecebimento: values.dataRecebimento?.toISOString(),
      }
      if (editando) await remessasService.atualizar(editando.id, payload)
      else await remessasService.criar(payload)
      message.success(editando ? 'Atualizado!' : 'Criado!')
      fecharModal()
      carregar()
    } catch {
      message.error('Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  const colunas = [
    { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
    { title: 'Origem', dataIndex: 'origemTipo', key: 'origemTipo' },
    {
      title: 'Data Envio',
      dataIndex: 'dataEnvio',
      key: 'dataEnvio',
      render: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : '-',
    },
    {
      title: 'Data Recebimento',
      dataIndex: 'dataRecebimento',
      key: 'dataRecebimento',
      render: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : '-',
    },
    { title: 'Clínica', dataIndex: 'clinicaId', key: 'clinicaId' },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, registro) => (
        <Button type="link" onClick={() => abrirModal(registro)}>Editar</Button>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader titulo="Remessas" acaoPrincipal={{ label: '+ Nova Remessa', onClick: () => abrirModal() }} />
      <Table
        dataSource={dados}
        columns={colunas}
        rowKey="id"
        loading={carregando}
        pagination={{
          current: page,
          total,
          pageSize: 20,
          onChange: setPage,
          showTotal: (t) => `${t} registros`,
        }}
      />
      <Modal
        title={editando ? 'Editar Remessa' : 'Nova Remessa'}
        open={modalAberto}
        onCancel={fecharModal}
        onOk={() => form.submit()}
        okText="Salvar"
        confirmLoading={salvando}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={form} layout="vertical" onFinish={salvar}>
          <Form.Item
            name="codigo"
            label="Código"
            rules={[{ required: true, message: 'Informe o código.' }, { min: 3, message: 'Mínimo 3 caracteres.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="origemTipo"
            label="Origem"
            rules={[{ required: true, message: 'Informe a origem.' }, { min: 2, message: 'Mínimo 2 caracteres.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="dataEnvio" label="Data de Envio">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="dataRecebimento" label="Data de Recebimento">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="clinicaId" label="Clínica">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

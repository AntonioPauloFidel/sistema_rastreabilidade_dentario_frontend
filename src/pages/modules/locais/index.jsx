import { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, message } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { locaisService } from '../../../services/locais/locais.service'
import styles from './styles.module.css'

export default function Locais() {
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
      const res = await locaisService.listar({ page: p, limit: 20 })
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
      if (editando) await locaisService.atualizar(editando.id, values)
      else await locaisService.criar(values)
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
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Tipo', dataIndex: 'tipo', key: 'tipo' },
    { title: 'Sala', dataIndex: 'sala', key: 'sala' },
    { title: 'Armário', dataIndex: 'armario', key: 'armario' },
    { title: 'Prateleira', dataIndex: 'prateleira', key: 'prateleira' },
    { title: 'Caixa', dataIndex: 'caixa', key: 'caixa' },
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
      <PageHeader titulo="Locais de Armazenamento" acaoPrincipal={{ label: '+ Novo Local', onClick: () => abrirModal() }} />
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
        title={editando ? 'Editar Local' : 'Novo Local'}
        open={modalAberto}
        onCancel={fecharModal}
        onOk={() => form.submit()}
        okText="Salvar"
        confirmLoading={salvando}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={form} layout="vertical" onFinish={salvar}>
          <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Informe o tipo.' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sala" label="Sala">
            <Input />
          </Form.Item>
          <Form.Item name="armario" label="Armário">
            <Input />
          </Form.Item>
          <Form.Item name="prateleira" label="Prateleira">
            <Input />
          </Form.Item>
          <Form.Item name="caixa" label="Caixa">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

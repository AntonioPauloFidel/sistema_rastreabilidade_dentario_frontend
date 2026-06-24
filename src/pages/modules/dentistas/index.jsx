import { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, Tag, message } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { dentistasService } from '../../../services/dentistas/dentistas.service'
import styles from './styles.module.css'

export default function Dentistas() {
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
      const res = await dentistasService.listar({ page: p, limit: 20 })
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
      if (editando) await dentistasService.atualizar(editando.id, values)
      else await dentistasService.criar(values)
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
    { title: 'CRO', dataIndex: 'cro', key: 'cro' },
    { title: 'UF CRO', dataIndex: 'ufCro', key: 'ufCro' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
    { title: 'Clínica', dataIndex: 'clinicaId', key: 'clinicaId' },
    {
      title: 'Ativo',
      dataIndex: 'ativo',
      key: 'ativo',
      render: (val) => <Tag color={val ? 'green' : 'default'}>{val ? 'Ativo' : 'Inativo'}</Tag>,
    },
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
      <PageHeader titulo="Dentistas" acaoPrincipal={{ label: '+ Novo Dentista', onClick: () => abrirModal() }} />
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
        title={editando ? 'Editar Dentista' : 'Novo Dentista'}
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
          <Form.Item
            name="cro"
            label="CRO"
            rules={[{ required: true, message: 'Informe o CRO.' }, { min: 3, message: 'Mínimo 3 caracteres.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="ufCro" label="UF CRO" rules={[{ max: 2, message: 'Máximo 2 caracteres.' }]}>
            <Input maxLength={2} />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="telefone" label="Telefone">
            <Input />
          </Form.Item>
          <Form.Item name="clinicaId" label="Clínica">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

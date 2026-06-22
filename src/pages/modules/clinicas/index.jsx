import { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, Tag, message } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { clinicasService } from '../../../services/clinicas/clinicas.service'
import styles from './styles.module.css'

export default function Clinicas() {
  const [dados, setDados] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [filtroNome, setFiltroNome] = useState('')
  const [form] = Form.useForm()

  async function carregar(p = page, nome = filtroNome) {
    setCarregando(true)
    try {
      const res = await clinicasService.listar({ page: p, limit: 20, nome: nome || undefined })
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
      if (editando) await clinicasService.atualizar(editando.id, values)
      else await clinicasService.criar(values)
      message.success(editando ? 'Atualizado!' : 'Criado!')
      fecharModal()
      carregar()
    } catch {
      message.error('Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  function buscar() {
    setPage(1)
    carregar(1, filtroNome)
  }

  const colunas = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj' },
    { title: 'Responsável', dataIndex: 'responsavel', key: 'responsavel' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
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
      <PageHeader titulo="Clínicas" acaoPrincipal={{ label: '+ Nova Clínica', onClick: () => abrirModal() }} />
      <div className={styles.filtros}>
        <Input
          placeholder="Buscar por nome"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
          onPressEnter={buscar}
          style={{ width: 240 }}
          allowClear
          onClear={() => { setFiltroNome(''); setPage(1); carregar(1, '') }}
        />
        <Button onClick={buscar} type="primary" style={{ background: '#038C5A', borderColor: '#038C5A' }}>Buscar</Button>
      </div>
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
        title={editando ? 'Editar Clínica' : 'Nova Clínica'}
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
          <Form.Item name="cnpj" label="CNPJ">
            <Input />
          </Form.Item>
          <Form.Item name="responsavel" label="Responsável">
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>
          <Form.Item name="telefone" label="Telefone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

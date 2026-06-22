import { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, message, DatePicker } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { doadoresService } from '../../../services/doadores/doadores.service'
import styles from './styles.module.css'

function mascararCpf(cpf) {
  if (!cpf || cpf.length !== 11) return cpf
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***.***.$3-$4')
}

export default function Doadores() {
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
      const res = await doadoresService.listar({ page: p, limit: 20 })
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
        dataNascimento: values.dataNascimento?.toISOString(),
      }
      if (editando) await doadoresService.atualizar(editando.id, payload)
      else await doadoresService.criar(payload)
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
    {
      title: 'CPF',
      dataIndex: 'cpf',
      key: 'cpf',
      render: (val) => mascararCpf(val),
    },
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    { title: 'Data Nascimento', dataIndex: 'dataNascimento', key: 'dataNascimento',
      render: (val) => val ? new Date(val).toLocaleDateString('pt-BR') : '-' },
    { title: 'Contato', dataIndex: 'contato', key: 'contato' },
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
      <PageHeader titulo="Doadores" acaoPrincipal={{ label: '+ Novo Doador', onClick: () => abrirModal() }} />
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
        title={editando ? 'Editar Doador' : 'Novo Doador'}
        open={modalAberto}
        onCancel={fecharModal}
        onOk={() => form.submit()}
        okText="Salvar"
        confirmLoading={salvando}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={form} layout="vertical" onFinish={salvar}>
          <Form.Item
            name="cpf"
            label="CPF"
            rules={[{ required: true, message: 'Informe o CPF.' }, { min: 11, message: 'Mínimo 11 dígitos.' }]}
          >
            <Input maxLength={11} />
          </Form.Item>
          <Form.Item name="nome" label="Nome">
            <Input />
          </Form.Item>
          <Form.Item name="dataNascimento" label="Data de Nascimento">
            <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>
          <Form.Item name="contato" label="Contato">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

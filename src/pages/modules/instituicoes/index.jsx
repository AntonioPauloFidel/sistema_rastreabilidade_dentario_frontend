import { useState, useEffect } from 'react'
import { Table, Modal, Form, Input, Button, Select, message } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { instituicoesService } from '../../../services/instituicoes/instituicoes.service'
import { TIPO_INSTITUICAO, toSelectOptions } from '../../../constants/enums'
import styles from './styles.module.css'

const tipoOptions = toSelectOptions(TIPO_INSTITUICAO)

export default function Instituicoes() {
  const [dados, setDados] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [modalAberto, setModalAberto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [salvando, setSalvando] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState(undefined)
  const [form] = Form.useForm()

  async function carregar(p = page, tipo = filtroTipo) {
    setCarregando(true)
    try {
      const res = await instituicoesService.listar({ page: p, limit: 20, tipo })
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
      if (editando) await instituicoesService.atualizar(editando.id, values)
      else await instituicoesService.criar(values)
      message.success(editando ? 'Atualizado!' : 'Criado!')
      fecharModal()
      carregar()
    } catch {
      message.error('Erro ao salvar.')
    } finally {
      setSalvando(false)
    }
  }

  function filtrar(tipo) {
    setFiltroTipo(tipo)
    setPage(1)
    carregar(1, tipo)
  }

  const colunas = [
    { title: 'Nome', dataIndex: 'nome', key: 'nome' },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (val) => TIPO_INSTITUICAO[val]?.label ?? val,
    },
    { title: 'CNPJ', dataIndex: 'cnpj', key: 'cnpj' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Telefone', dataIndex: 'telefone', key: 'telefone' },
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
      <PageHeader titulo="Instituições" acaoPrincipal={{ label: '+ Nova Instituição', onClick: () => abrirModal() }} />
      <div className={styles.filtros}>
        <Select
          placeholder="Filtrar por tipo"
          allowClear
          options={tipoOptions}
          value={filtroTipo}
          onChange={filtrar}
          style={{ width: 200 }}
        />
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
        title={editando ? 'Editar Instituição' : 'Nova Instituição'}
        open={modalAberto}
        onCancel={fecharModal}
        onOk={() => form.submit()}
        okText="Salvar"
        confirmLoading={salvando}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={form} layout="vertical" onFinish={salvar}>
          <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Informe o nome.' }, { min: 2, message: 'Mínimo 2 caracteres.' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="tipo" label="Tipo" rules={[{ required: true, message: 'Selecione o tipo.' }]}>
            <Select options={tipoOptions} />
          </Form.Item>
          <Form.Item name="cnpj" label="CNPJ" rules={[{ required: true, message: 'Informe o CNPJ.' }]}>
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

import { useEffect, useState } from 'react'
import {
  Table, Tag, Button, Select, Modal, Form, Input, Alert, Space, message,
} from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { EmptyState } from '../../../components/EmptyState'
import { usuariosService } from '../../../services/usuarios/usuarios.service'
import { PERFIL_USUARIO, toSelectOptions } from '../../../constants/enums'
import styles from './styles.module.css'

const PERFIL_OPTIONS = toSelectOptions(PERFIL_USUARIO)
const STATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'true', label: 'Ativo' },
  { value: 'false', label: 'Inativo' },
]
const LIMIT = 20

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  const [filtroPerfil, setFiltroPerfil] = useState(null)
  const [filtroAtivo, setFiltroAtivo] = useState('')

  const [modalCriar, setModalCriar] = useState(false)
  const [salvandoCriar, setSalvandoCriar] = useState(false)
  const [formCriar] = Form.useForm()

  const [modalPerfil, setModalPerfil] = useState(false)
  const [usuarioAlvo, setUsuarioAlvo] = useState(null)
  const [salvandoPerfil, setSalvandoPerfil] = useState(false)
  const [formPerfil] = Form.useForm()

  const [salvandoStatus, setSalvandoStatus] = useState(null)

  async function carregar(pagina = page) {
    setCarregando(true)
    setErro(null)
    try {
      const params = { page: pagina, limit: LIMIT }
      if (filtroPerfil) params.perfil = filtroPerfil
      if (filtroAtivo !== '') params.ativo = filtroAtivo
      const res = await usuariosService.listar(params)
      setUsuarios(res.data?.data ?? res.data?.usuarios ?? [])
      setTotal(res.data?.total ?? 0)
    } catch {
      setErro('Não foi possível carregar os usuários.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    carregar(1)
    setPage(1)
  }, [filtroPerfil, filtroAtivo])

  async function handleCriar(valores) {
    setSalvandoCriar(true)
    try {
      await usuariosService.criar(valores)
      message.success('Usuário criado com sucesso!')
      formCriar.resetFields()
      setModalCriar(false)
      carregar(page)
    } catch (err) {
      message.error(err?.response?.data?.message ?? 'Erro ao criar usuário.')
    } finally {
      setSalvandoCriar(false)
    }
  }

  function abrirModalPerfil(usuario) {
    setUsuarioAlvo(usuario)
    formPerfil.setFieldsValue({ perfil: usuario.perfil })
    setModalPerfil(true)
  }

  async function handleAlterarPerfil(valores) {
    if (!usuarioAlvo) return
    setSalvandoPerfil(true)
    try {
      await usuariosService.alterarPerfil(usuarioAlvo.id, valores.perfil)
      message.success('Perfil alterado com sucesso!')
      setModalPerfil(false)
      carregar(page)
    } catch (err) {
      message.error(err?.response?.data?.message ?? 'Erro ao alterar perfil.')
    } finally {
      setSalvandoPerfil(false)
    }
  }

  async function handleAlterarStatus(usuario) {
    setSalvandoStatus(usuario.id)
    try {
      await usuariosService.alterarStatus(usuario.id, !usuario.ativo)
      message.success(`Usuário ${usuario.ativo ? 'inativado' : 'ativado'} com sucesso!`)
      carregar(page)
    } catch (err) {
      message.error(err?.response?.data?.message ?? 'Erro ao alterar status.')
    } finally {
      setSalvandoStatus(null)
    }
  }

  const colunas = [
    {
      title: 'Nome',
      key: 'nome',
      render: (_, rec) => rec.pessoa?.nome ?? rec.nome ?? '—',
    },
    {
      title: 'Email',
      key: 'email',
      render: (_, rec) => rec.pessoa?.email ?? rec.email ?? '—',
    },
    {
      title: 'Perfil',
      dataIndex: 'perfil',
      key: 'perfil',
      render: (v) => {
        const cfg = PERFIL_USUARIO[v]
        return cfg
          ? <Tag color={cfg.cor}>{cfg.label}</Tag>
          : <Tag>{v ?? '—'}</Tag>
      },
    },
    {
      title: 'Status',
      dataIndex: 'ativo',
      key: 'ativo',
      render: (v) => (
        <Tag color={v ? 'green' : 'red'}>{v ? 'Ativo' : 'Inativo'}</Tag>
      ),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (_, rec) => (
        <Space>
          <Button size="small" onClick={() => abrirModalPerfil(rec)}>
            Perfil
          </Button>
          <Button
            size="small"
            danger={rec.ativo}
            loading={salvandoStatus === rec.id}
            onClick={() => handleAlterarStatus(rec)}
          >
            {rec.ativo ? 'Inativar' : 'Ativar'}
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div className={styles.page}>
      <PageHeader
        titulo="Usuários"
        acaoPrincipal={{ label: '+ Novo Usuário', onClick: () => setModalCriar(true) }}
      />

      <div className={styles.filtros}>
        <Select
          placeholder="Filtrar por perfil"
          options={PERFIL_OPTIONS}
          value={filtroPerfil}
          onChange={setFiltroPerfil}
          allowClear
          style={{ width: 220 }}
        />
        <Select
          placeholder="Filtrar por status"
          options={STATUS_OPTIONS}
          value={filtroAtivo}
          onChange={(v) => setFiltroAtivo(v ?? '')}
          style={{ width: 160 }}
        />
        <Button
          onClick={() => { setFiltroPerfil(null); setFiltroAtivo('') }}
          disabled={!filtroPerfil && filtroAtivo === ''}
        >
          Limpar
        </Button>
      </div>

      {erro && <Alert type="error" showIcon message={erro} style={{ marginBottom: 16 }} />}

      <Table
        rowKey="id"
        loading={carregando}
        dataSource={usuarios}
        columns={colunas}
        locale={{ emptyText: <EmptyState mensagem="Nenhum usuário encontrado" /> }}
        pagination={{
          current: page,
          pageSize: LIMIT,
          total,
          onChange: (p) => { setPage(p); carregar(p) },
          showSizeChanger: false,
        }}
      />

      {/* Modal: Novo Usuário */}
      <Modal
        title="Novo Usuário"
        open={modalCriar}
        onCancel={() => { setModalCriar(false); formCriar.resetFields() }}
        onOk={() => formCriar.submit()}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={salvandoCriar}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form
          form={formCriar}
          layout="vertical"
          onFinish={handleCriar}
          initialValues={{ perfil: 'BIOBANCO_OPERADOR' }}
        >
          <Form.Item
            name="nome"
            label="Nome"
            rules={[
              { required: true, message: 'Informe o nome' },
              { min: 3, message: 'Nome deve ter pelo menos 3 caracteres' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Informe o email' },
              { type: 'email', message: 'Email inválido' },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="senha"
            label="Senha"
            rules={[
              { required: true, message: 'Informe a senha' },
              { min: 8, message: 'Senha deve ter pelo menos 8 caracteres' },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="perfil"
            label="Perfil"
            rules={[{ required: true, message: 'Selecione o perfil' }]}
          >
            <Select options={PERFIL_OPTIONS} placeholder="Selecione" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal: Alterar Perfil */}
      <Modal
        title="Alterar Perfil"
        open={modalPerfil}
        onCancel={() => { setModalPerfil(false); formPerfil.resetFields() }}
        onOk={() => formPerfil.submit()}
        okText="Confirmar"
        cancelText="Cancelar"
        confirmLoading={salvandoPerfil}
        okButtonProps={{ style: { background: '#038C5A', borderColor: '#038C5A' } }}
      >
        <Form form={formPerfil} layout="vertical" onFinish={handleAlterarPerfil}>
          <Form.Item
            name="perfil"
            label="Novo Perfil"
            rules={[{ required: true, message: 'Selecione o perfil' }]}
          >
            <Select options={PERFIL_OPTIONS} placeholder="Selecione" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

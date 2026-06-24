import { useState } from 'react'
import { Form, Input, Button, message, Divider } from 'antd'
import { PageHeader } from '../../../components/PageHeader'
import { useAuth } from '../../../hooks/useAuth'
import { authService } from '../../../services/auth/auth.service'
import styles from './styles.module.css'

function getIniciais(nome) {
  if (!nome) return '?'
  const partes = nome.trim().split(/\s+/)
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

export default function Perfil() {
  const { usuario } = useAuth()

  const nome = usuario?.pessoa?.nome ?? usuario?.nome ?? ''
  const email = usuario?.pessoa?.email ?? usuario?.email ?? ''

  const [formDados] = Form.useForm()
  const [salvandoDados, setSalvandoDados] = useState(false)

  const [formSenha] = Form.useForm()
  const [salvandoSenha, setSalvandoSenha] = useState(false)

  async function handleSalvarDados(valores) {
    setSalvandoDados(true)
    try {
      await authService.atualizarPerfil(valores)
      message.success('Dados atualizados com sucesso!')
    } catch (err) {
      message.error(err?.response?.data?.message ?? 'Erro ao atualizar dados.')
    } finally {
      setSalvandoDados(false)
    }
  }

  async function handleAlterarSenha(valores) {
    setSalvandoSenha(true)
    try {
      await authService.alterarSenha({
        senhaAtual: valores.senhaAtual,
        novaSenha: valores.novaSenha,
      })
      message.success('Senha alterada com sucesso!')
      formSenha.resetFields()
    } catch (err) {
      message.error(err?.response?.data?.message ?? 'Erro ao alterar senha.')
    } finally {
      setSalvandoSenha(false)
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader titulo="Meu Perfil" />

      <div className={styles.conteudo}>
        {/* Seção 1 — Meus dados */}
        <div className={styles.secao}>
          <div className={styles.avatarArea}>
            <div className={styles.avatar}>{getIniciais(nome)}</div>
            <div className={styles.avatarInfo}>
              <span className={styles.avatarNome}>{nome || '—'}</span>
              <span className={styles.avatarEmail}>{email || '—'}</span>
            </div>
          </div>

          <Divider />

          <h3 className={styles.secaoTitulo}>Editar dados</h3>
          <Form
            form={formDados}
            layout="vertical"
            onFinish={handleSalvarDados}
            initialValues={{ nome, email }}
          >
            <Form.Item
              name="nome"
              label="Nome"
              rules={[{ required: true, message: 'Informe o nome' }]}
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
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={salvandoDados}
                style={{ background: '#038C5A', borderColor: '#038C5A' }}
              >
                Salvar alterações
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* Seção 2 — Alterar senha */}
        <div className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Alterar senha</h3>
          <Form form={formSenha} layout="vertical" onFinish={handleAlterarSenha}>
            <Form.Item
              name="senhaAtual"
              label="Senha atual"
              rules={[{ required: true, message: 'Informe a senha atual' }]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="novaSenha"
              label="Nova senha"
              rules={[
                { required: true, message: 'Informe a nova senha' },
                { min: 8, message: 'A senha deve ter pelo menos 8 caracteres' },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirmarSenha"
              label="Confirmar nova senha"
              dependencies={['novaSenha']}
              rules={[
                { required: true, message: 'Confirme a nova senha' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('novaSenha') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('As senhas não coincidem'))
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={salvandoSenha}
                style={{ background: '#038C5A', borderColor: '#038C5A' }}
              >
                Alterar senha
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}

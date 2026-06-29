import { useEffect, useRef, useState } from 'react'
import { Form, Input, Button, message, Divider, Spin } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { PageHeader } from '../../../components/PageHeader'
import { useAuth } from '../../../hooks/useAuth'
import { authService } from '../../../services/auth/auth.service'
import { enderecoService } from '../../../services/enderecos/enderecos.service'
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

  const [formEndereco] = Form.useForm()
  const [salvandoEndereco, setSalvandoEndereco] = useState(false)
  const [buscandoCep, setBuscandoCep] = useState(false)
  const [cepErro, setCepErro] = useState(null)
  const ultimoCepBuscado = useRef('')

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

  const buscarEnderecoPorCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, '')
    if (cepLimpo.length !== 8 || ultimoCepBuscado.current === cepLimpo) return

    ultimoCepBuscado.current = cepLimpo
    setCepErro(null)
    setBuscandoCep(true)
    try {
      const res = await enderecoService.buscarPorCep(cepLimpo)
      const payload = res.data
      const endereco = payload?.data ?? payload
      if (!endereco || !endereco.cep) {
        setCepErro('CEP não encontrado.')
        return
      }

      formEndereco.setFieldsValue({
        logradouro: endereco.logradouro ?? endereco.rua ?? '',
        bairro: endereco.bairro ?? '',
        cidade: endereco.cidade ?? endereco.localidade ?? '',
        uf: endereco.uf ?? endereco.estado ?? '',
      })
    } catch (err) {
      if (err?.response?.status === 404) {
        setCepErro('CEP não encontrado.')
      } else {
        setCepErro('CEP inválido ou erro na busca.')
      }
    } finally {
      setBuscandoCep(false)
    }
  }

  const handleCepChange = (_, allValues) => {
    const cep = allValues?.cep ?? ''
    const cepLimpo = cep.replace(/\D/g, '')
    setCepErro(null)
    if (cepLimpo.length === 8) {
      buscarEnderecoPorCep(cepLimpo)
    }
  }

  const handleSalvarEndereco = async (valores) => {
    setSalvandoEndereco(true)
    try {
      await enderecoService.salvarMe(valores)
      message.success('Endereço salvo com sucesso!')
    } catch (err) {
      message.error(err?.response?.data?.message ?? 'Erro ao salvar o endereço.')
    } finally {
      setSalvandoEndereco(false)
    }
  }

  useEffect(() => {
    const carregarEndereco = async () => {
      try {
        const res = await enderecoService.buscarMe()
        const endereco = res.data?.data ?? res.data
        if (endereco) {
          formEndereco.setFieldsValue({
            cep: endereco.cep ?? '',
            logradouro: endereco.logradouro ?? '',
            numero: endereco.numero ?? '',
            complemento: endereco.complemento ?? '',
            bairro: endereco.bairro ?? '',
            cidade: endereco.cidade ?? '',
            uf: endereco.uf ?? '',
          })
        }
      } catch {
        // ignorar carga inicial de endereço
      }
    }

    carregarEndereco()
  }, [formEndereco])

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

        <div className={styles.secao}>
          <h3 className={styles.secaoTitulo}>Endereço</h3>
          <Form
            form={formEndereco}
            layout="vertical"
            onFinish={handleSalvarEndereco}
            onValuesChange={handleCepChange}
          >
            <Form.Item
              name="cep"
              label="CEP"
              rules={[
                { required: true, message: 'Informe o CEP' },
                { pattern: /^\d{5}-\d{3}$/, message: 'CEP inválido' },
              ]}
              validateStatus={cepErro ? 'error' : ''}
              help={cepErro}
            >
              <Input.Search
                placeholder="00000-000"
                enterButton={<SearchOutlined />}
                loading={buscandoCep}
                onSearch={(value) => buscarEnderecoPorCep(value)}
                onChange={(event) => {
                  const value = event.target.value.replace(/[^\d]/g, '')
                  const formatted = value.replace(/(\d{5})(\d{1,3})/, '$1-$2')
                  formEndereco.setFieldsValue({ cep: formatted })
                }}
                maxLength={9}
              />
            </Form.Item>

            <Form.Item
              name="logradouro"
              label="Logradouro"
              rules={[{ required: true, message: 'Informe o logradouro' }]}
            >
              <Input disabled={buscandoCep} suffix={buscandoCep ? <Spin size="small" /> : null} />
            </Form.Item>

            <div className={styles.duasColunas}>
              <Form.Item
                name="numero"
                label="Número"
                rules={[{ required: true, message: 'Informe o número' }]}
                style={{ flex: 1 }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="complemento"
                label="Complemento"
                style={{ flex: 1 }}
              >
                <Input />
              </Form.Item>
            </div>

            <Form.Item
              name="bairro"
              label="Bairro"
              rules={[{ required: true, message: 'Informe o bairro' }]}
            >
              <Input disabled={buscandoCep} />
            </Form.Item>

            <div className={styles.duasColunas}>
              <Form.Item
                name="cidade"
                label="Cidade"
                rules={[{ required: true, message: 'Informe a cidade' }]}
                style={{ flex: 2 }}
              >
                <Input disabled={buscandoCep} />
              </Form.Item>

              <Form.Item
                name="uf"
                label="UF"
                rules={[{ required: true, message: 'Informe a UF' }]}
                style={{ flex: 1 }}
              >
                <Input maxLength={2} disabled={buscandoCep} />
              </Form.Item>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={salvandoEndereco}
                style={{ background: '#038C5A', borderColor: '#038C5A' }}
              >
                Salvar endereço
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

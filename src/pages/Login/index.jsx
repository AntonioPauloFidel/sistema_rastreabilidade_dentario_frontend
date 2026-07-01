import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Checkbox } from 'antd'
import { Mail, Lock, ShieldCheck, BarChart2, Users } from 'lucide-react'
import logoPng from '../../assets/Logo.png'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.css'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [form] = Form.useForm()

  const destino = location.state?.from?.pathname ?? '/home'

  async function onSubmit({ email, senha }) {
    setErro(null)
    setCarregando(true)
    try {
      await login(email, senha)
      navigate(destino, { replace: true })
    } catch (err) {
      const mensagem = err?.response?.data?.mensagem
        ?? err?.response?.data?.message
        ?? err?.response?.data?.error
        ?? err?.message

      if (err?.code === 'ERR_NETWORK' || err?.message === 'Network Error') {
        setErro('Não foi possível conectar com o servidor. Verifique se o backend está rodando.')
      } else if (err?.response?.status === 401) {
        setErro('E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.')
      } else {
        setErro(mensagem || 'Credenciais inválidas. Tente novamente.')
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* Pontos decorativos */}
      <div className={styles.dots} aria-hidden />

      <div className={styles.container}>

        {/* ── Coluna esquerda — Login ── */}
        <div className={styles.left}>
          <div className={styles.logoRow}>
            <img src={logoPng} alt="Sirde" className={styles.logoImg} />
          </div>

          <h1 className={styles.titulo}>
            Bem-vindo{' '}
            <span className={styles.tituloAccent}>de volta!</span>
          </h1>
          <p className={styles.subtitulo}>Faça login para continuar</p>

          {erro && (
            <div className={styles.erroBox}>{erro}</div>
          )}

          <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false} className={styles.form}>
            <Form.Item
              name="email"
              label={<span className={styles.label}>E-mail</span>}
              rules={[
                { required: true, message: 'E-mail obrigatório' },
                { type: 'email', message: 'E-mail inválido' },
              ]}
            >
              <Input
                prefix={<Mail size={18} color="#6B7280" />}
                placeholder="Digite seu e-mail"
                size="large"
                autoComplete="email"
                className={styles.input}
              />
            </Form.Item>

            <Form.Item
              name="senha"
              label={<span className={styles.label}>Senha</span>}
              rules={[
                { required: true, message: 'Senha obrigatória' },
                { min: 8, message: 'Mínimo 8 caracteres' },
              ]}
            >
              <Input.Password
                prefix={<Lock size={18} color="#6B7280" />}
                placeholder="Digite sua senha"
                size="large"
                autoComplete="current-password"
                className={styles.input}
              />
            </Form.Item>

            <div className={styles.lembrarRow}>
              <Checkbox className={styles.checkbox}>Lembrar-me</Checkbox>
              <button type="button" className={styles.forgotLink}>Esqueceu sua senha?</button>
            </div>

            <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
              <button
                type="submit"
                className={styles.btnEntrar}
                disabled={carregando}
              >
                {carregando ? 'Entrando…' : 'Entrar'}
              </button>
            </Form.Item>
          </Form>

          <p className={styles.cadastroTexto}>
            Não tem uma conta?{' '}
            <button type="button" className={styles.cadastroLink}>Cadastre-se</button>
          </p>
        </div>

        {/* ── Coluna direita — Apresentação ── */}
        <div className={styles.right}>
          <div className={styles.card}>
            <img src={logoPng} alt="Sirde" className={styles.cardLogo} />

            <p className={styles.cardSubtitulo}>Rastreamento Inteligente de Dentes</p>

            <p className={styles.cardDesc}>
              Simplifique o controle de materiais odontológicos com um sistema desenvolvido para garantir organização, transparência e rastreabilidade.
            </p>

            <div className={styles.beneficios}>
              <div className={styles.beneficio}>
                <ShieldCheck size={48} color="#05F29B" strokeWidth={1.5} />
                <span className={styles.beneficioLabel}>Seguro</span>
              </div>
              <div className={styles.beneficio}>
                <BarChart2 size={48} color="#05F29B" strokeWidth={1.5} />
                <span className={styles.beneficioLabel}>Eficiente</span>
              </div>
              <div className={styles.beneficio}>
                <Users size={48} color="#05F29B" strokeWidth={1.5} />
                <span className={styles.beneficioLabel}>Completo</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

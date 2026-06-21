import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Form, Input, Button, Alert } from 'antd'
import { MailOutlined, LockOutlined, StarFilled } from '@ant-design/icons'
import logoPng from '../../assets/Logo.png'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.css'


export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [showSplash, setShowSplash] = useState(true)
  const [form] = Form.useForm()

  const destino = location.state?.from?.pathname ?? '/home'

  async function onSubmit({ email, senha }) {
    setErro(null)
    setCarregando(true)
    try {
      await login(email, senha)
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Credenciais inválidas. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1200)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      {showSplash && (
        <div className={styles.splash}>
          <img src={logoPng} alt="Splash" className={styles.splashImage} />
        </div>
      )}

      <div className={styles.page}>
        <div className={styles.container}>

        <div className={styles.leftCard}>
          <div className={styles.iconWrapper}>
            <img src={logoPng} alt="Logo Sirde" className={styles.logoImage} />
          </div>

          <h1 className={styles.heading}>Bem-vindo de volta à sua área de trabalho</h1>
          <p className={styles.subheading}>
            Gerencie, acompanhe e rastreie processos odontológicos em um único sistema.
          </p>

          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>Gestão completa de pacientes</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>Agendamentos simplificados</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureIcon}>✓</span>
              <span>Relatórios em tempo real</span>
            </div>
          </div>
        </div>

        {/* Card direito */}
        <div className={styles.rightCard}>
          <h2 className={styles.formTitle}>Entrar na conta</h2>
          <p className={styles.formSubtitle}>
            Não tem conta? <span className={styles.link}>Criar gratuitamente</span>
          </p>

          {erro && <Alert type="error" showIcon style={{ marginBottom: 20 }}>{erro}</Alert>}

          <Form form={form} layout="vertical" onFinish={onSubmit} requiredMark={false}>
            <Form.Item
              name="email"
              label={<span className={styles.label}>E-mail</span>}
              rules={[
                { required: true, message: 'E-mail obrigatório' },
                { type: 'email', message: 'E-mail inválido' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                placeholder="voce@empresa.com"
                size="large"
                autoComplete="email"
                className={styles.input}
              />
            </Form.Item>

            {/* Campo de Senha */}
            <Form.Item
              name="senha"
              label={<span className={styles.label}>Senha</span>}
              rules={[
                { required: true, message: 'Senha obrigatória' },
                { min: 8, message: 'Mínimo 8 caracteres' },
              ]}
              style={{ marginBottom: 24 }}
            >
              <div className={styles.senhaInputContainer}>
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                  placeholder="••••••••"
                  size="large"
                  autoComplete="current-password"
                  className={styles.input}
                />

                <div className={styles.senhaRow}>
                  <span className={styles.link}>Esqueceu a senha?</span>
                </div>
              </div>
            </Form.Item>

            {/* Botão de Enviar */}
            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={carregando}
                size="large"
                block
                className={styles.submitBtn}
              >
                Entrar na conta →
              </Button>
            </Form.Item>
          </Form>

          <p className={styles.terms}>
            Ao continuar, você concorda com nossos{' '}
            <span className={styles.link}>Termos de Uso</span> e{' '}
            <span className={styles.link}>Política de Privacidade</span>.
          </p>
        </div>

      </div>
    </div>
    </>
  )
}
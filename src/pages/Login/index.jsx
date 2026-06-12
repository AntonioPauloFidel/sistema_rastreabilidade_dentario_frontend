import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, Input, Button, Alert } from 'antd'
import { MailOutlined, LockOutlined, StarFilled } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.css'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

function ToothSVG() {
  return (
    <div className={styles.toothGlow}>
      <svg width="110" height="130" viewBox="0 0 110 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Corpo do dente */}
        <path
          d="M55 6
             C42 6 28 14 22 26
             C16 38 18 54 22 66
             C25 76 28 86 30 100
             C32 112 35 126 41 126
             C46 126 48 112 55 112
             C62 112 64 126 69 126
             C75 126 78 112 80 100
             C82 86 85 76 88 66
             C92 54 94 38 88 26
             C82 14 68 6 55 6Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Cúspide esquerda */}
        <path
          d="M30 32 C28 22 34 10 42 8 C46 7 50 10 51 16 C52 22 50 30 46 36 C42 40 34 40 30 36Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Cúspide direita */}
        <path
          d="M80 32 C82 22 76 10 68 8 C64 7 60 10 59 16 C58 22 60 30 64 36 C68 40 76 40 80 36Z"
          fill="white"
          fillOpacity="0.95"
        />
        {/* Sulco central */}
        <path d="M55 12 C55 24 55 38 55 50" stroke="rgba(3,140,90,0.2)" strokeWidth="2" strokeLinecap="round" />
        {/* Linha de detalhe horizontal */}
        <path d="M34 58 C42 62 48 64 55 64 C62 64 68 62 76 58" stroke="rgba(3,140,90,0.15)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        {/* Brilho */}
        <ellipse cx="40" cy="30" rx="10" ry="14" fill="white" fillOpacity="0.5" />
        <ellipse cx="36" cy="26" rx="4" ry="6" fill="white" fillOpacity="0.6" />
      </svg>
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [erro, setErro] = useState(null)

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', senha: '' },
  })

  const destino = location.state?.from?.pathname ?? '/dashboard'

  async function onSubmit({ email, senha }) {
    setErro(null)
    try {
      await login(email, senha)
      navigate(destino, { replace: true })
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Card esquerdo */}
        <div className={styles.leftCard}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>S</span>
            <span className={styles.logoText}>Sirde</span>
          </div>

          <ToothSVG />

          <span className={styles.badge}>● Plataforma segura</span>

          <h1 className={styles.heading}>Bem-vindo de volta à sua área de trabalho</h1>
          <p className={styles.subheading}>
            Gerencie projetos, colabore com sua equipe e acompanhe métricas em tempo real.
          </p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statValue}>12k+</span>
              <span className={styles.statLabel}>Usuários</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>99.9%</span>
              <span className={styles.statLabel}>Uptime</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statValue}>4.9<StarFilled style={{ fontSize: 11, marginLeft: 1 }} /></span>
              <span className={styles.statLabel}>Avaliação</span>
            </div>
          </div>

          <div className={styles.testimonial}>
            <p className={styles.testimonialText}>
              "A Sirde aumentou nossa produtividade em 40% no primeiro mês de uso."
            </p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}>A</div>
              <div>
                <div className={styles.testimonialName}>Ana Beatriz Costa</div>
                <div className={styles.testimonialRole}>Diretora de Produto · TechBrasil</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card direito */}
        <div className={styles.rightCard}>
          <h2 className={styles.formTitle}>Entrar na conta</h2>
          <p className={styles.formSubtitle}>
            Não tem conta? <span className={styles.link}>Criar gratuitamente</span>
          </p>

          {erro && <Alert message={erro} type="error" showIcon style={{ marginBottom: 20 }} />}

          <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
            <Form.Item
              label={<span className={styles.label}>E-mail</span>}
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="voce@empresa.com"
                    size="large"
                    className={styles.input}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={
                <div className={styles.senhaRow}>
                  <span className={styles.label}>Senha</span>
                  <span className={styles.link}>Esqueceu a senha?</span>
                </div>
              }
              validateStatus={errors.senha ? 'error' : ''}
              help={errors.senha?.message}
            >
              <Controller
                name="senha"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
                    placeholder="••••••••"
                    size="large"
                    className={styles.input}
                  />
                )}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 8, marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
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
  )
}

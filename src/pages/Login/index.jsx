import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { MailOutlined, LockOutlined, StarFilled } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import styles from './styles.module.css'

const { Text } = Typography

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

function ToothIcon() {
  return (
    <svg width="160" height="190" viewBox="0 0 160 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="toothBody" cx="45%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#c8c8c8" />
        </radialGradient>
        <radialGradient id="toothRoot1" cx="40%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#dcdcdc" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </radialGradient>
        <radialGradient id="toothRoot2" cx="60%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#d8d8d8" />
          <stop offset="100%" stopColor="#aaaaaa" />
        </radialGradient>
        <radialGradient id="shine" cx="38%" cy="28%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter id="shadow" x="-20%" y="-10%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.25" />
        </filter>
        <filter id="innerShadow">
          <feOffset dx="2" dy="3" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>

      <g filter="url(#shadow)">
        {/* Raiz esquerda */}
        <path
          d="M52 118 C48 130 44 148 43 165 C42 172 46 176 51 174 C56 172 58 158 60 142 L65 118 Z"
          fill="url(#toothRoot1)"
        />
        {/* Raiz direita */}
        <path
          d="M108 118 C112 130 116 148 117 165 C118 172 114 176 109 174 C104 172 102 158 100 142 L95 118 Z"
          fill="url(#toothRoot2)"
        />
        {/* Raiz central pequena */}
        <path
          d="M72 122 C70 138 69 155 70 168 C71 174 75 176 80 176 C85 176 89 174 90 168 C91 155 90 138 88 122 Z"
          fill="url(#toothRoot1)"
        />

        {/* Corpo principal do dente */}
        <path
          d="M28 72 C26 58 28 42 34 32 C40 20 50 14 58 12 C64 10 68 12 74 16 C78 18 80 20 80 20 C80 20 82 18 86 16 C92 12 96 10 102 12 C110 14 120 20 126 32 C132 42 134 58 132 72 C130 84 126 94 122 104 C118 114 112 120 80 120 C48 120 42 114 38 104 C34 94 30 84 28 72 Z"
          fill="url(#toothBody)"
        />

        {/* Cúspides superiores */}
        {/* Cúspide esquerda */}
        <path
          d="M46 38 C44 28 48 18 56 14 C60 12 64 14 66 20 C68 26 66 34 62 40 C58 44 52 44 48 42 Z"
          fill="url(#toothBody)"
        />
        {/* Cúspide centro-esquerda */}
        <path
          d="M68 34 C67 24 70 16 76 13 C79 12 82 13 84 18 C86 23 85 31 82 37 C79 42 73 43 70 40 Z"
          fill="url(#toothBody)"
        />
        {/* Cúspide centro-direita */}
        <path
          d="M92 34 C93 24 90 16 84 13 C81 12 78 13 76 18 C74 23 75 31 78 37 C81 42 87 43 90 40 Z"
          fill="url(#toothBody)"
        />
        {/* Cúspide direita */}
        <path
          d="M114 38 C116 28 112 18 104 14 C100 12 96 14 94 20 C92 26 94 34 98 40 C102 44 108 44 112 42 Z"
          fill="url(#toothBody)"
        />

        {/* Sulcos entre cúspides */}
        <path d="M66 20 C68 28 68 36 66 42" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M94 20 C92 28 92 36 94 42" stroke="#c0c0c0" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M80 14 C80 22 80 34 80 44" stroke="#c8c8c8" strokeWidth="1" strokeLinecap="round" />

        {/* Sulco horizontal */}
        <path d="M52 52 C62 56 72 58 80 58 C88 58 98 56 108 52" stroke="#d0d0d0" strokeWidth="1.5" strokeLinecap="round" fill="none" />

        {/* Reflexo/brilho principal */}
        <ellipse cx="58" cy="38" rx="18" ry="22" fill="url(#shine)" />

        {/* Brilho secundário menor */}
        <ellipse cx="96" cy="28" rx="8" ry="10" fill="white" fillOpacity="0.35" />

        {/* Borda de profundidade - sombra interna lateral direita */}
        <path
          d="M126 68 C128 80 126 94 122 104 C118 114 112 120 80 120"
          stroke="#b8b8b8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
      </g>

      {/* Sombra no chão */}
      <ellipse cx="80" cy="182" rx="38" ry="6" fill="black" fillOpacity="0.15" />
    </svg>
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
    <div className={styles.wrapper}>
      {/* Coluna esquerda */}
      <div className={styles.left}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>S</span>
          <span className={styles.logoText}>Sirde</span>
        </div>

        <div className={styles.toothWrapper}>
          <ToothIcon />
        </div>

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
            <span className={styles.statValue}>4.9<StarFilled style={{ fontSize: 12 }} /></span>
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
              <div className={styles.testimonialRole}>Diretora de Produto - TechBrasil</div>
            </div>
          </div>
        </div>
      </div>

      {/* Coluna direita */}
      <div className={styles.right}>
        <div className={styles.formBox}>
          <h2 className={styles.formTitle}>Entrar na conta</h2>
          <p className={styles.formSubtitle}>
            Não tem conta?{' '}
            <span className={styles.formLink}>Criar gratuitamente</span>
          </p>

          {erro && <Alert message={erro} type="error" showIcon style={{ marginBottom: 20 }} />}

          <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
            <Form.Item
              label={<span className={styles.fieldLabel}>E-mail</span>}
              validateStatus={errors.email ? 'error' : ''}
              help={errors.email?.message}
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    prefix={<MailOutlined className={styles.inputIcon} />}
                    placeholder="voce@empresa.com"
                    size="large"
                    className={styles.input}
                  />
                )}
              />
            </Form.Item>

            <Form.Item
              label={
                <div className={styles.senhaLabel}>
                  <span className={styles.fieldLabel}>Senha</span>
                  <span className={styles.formLink}>Esqueceu a senha?</span>
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
                    prefix={<LockOutlined className={styles.inputIcon} />}
                    placeholder="••••••••"
                    size="large"
                    className={styles.input}
                  />
                )}
              />
            </Form.Item>

            <Form.Item style={{ marginTop: 8 }}>
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
            <span className={styles.formLink}>Termos de Uso</span> e{' '}
            <span className={styles.formLink}>Política de Privacidade</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

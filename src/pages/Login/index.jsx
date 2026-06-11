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
    <svg width="100" height="120" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 8C34 8 18 20 18 38C18 52 22 62 26 74C29 84 32 108 38 108C43 108 44 92 50 92C56 92 57 108 62 108C68 108 71 84 74 74C78 62 82 52 82 38C82 20 66 8 50 8Z" fill="white" fillOpacity="0.9"/>
      <path d="M35 30C35 30 38 22 50 22C62 22 65 30 65 30" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round"/>
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

import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Form, Input, Button, Typography, Alert } from 'antd'
import { MailOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'

const { Title, Text } = Typography

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
})

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
      const mensagem = err.response?.data?.mensagem ?? 'Credenciais inválidas. Tente novamente.'
      setErro(mensagem)
    }
  }

  return (
    <Card style={{ width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <Title level={3} style={{ color: '#038C5A', margin: 0 }}>Entrar no sistema</Title>
        <Text type="secondary" style={{ fontSize: 13 }}>Use suas credenciais institucionais</Text>
      </div>

      {erro && (
        <Alert message={erro} type="error" showIcon style={{ marginBottom: 20 }} />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)} requiredMark={false}>
        <Form.Item
          label="E-mail"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} prefix={<MailOutlined />} placeholder="seu@email.com" size="large" />
            )}
          />
        </Form.Item>

        <Form.Item
          label="Senha"
          validateStatus={errors.senha ? 'error' : ''}
          help={errors.senha?.message}
        >
          <Controller
            name="senha"
            control={control}
            render={({ field }) => (
              <Input.Password {...field} prefix={<LockOutlined />} placeholder="Mínimo 8 caracteres" size="large" />
            )}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            size="large"
            block
            style={{ background: '#038C5A', borderColor: '#038C5A' }}
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

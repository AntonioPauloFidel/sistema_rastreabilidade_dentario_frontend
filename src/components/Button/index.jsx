import { Button as AntButton } from 'antd'

export function Button({ children, variante = 'primary', tamanho = 'middle', carregando = false, ...props }) {
  const mapVariante = {
    primary: 'primary',
    secondary: 'default',
    danger: 'primary',
    ghost: 'text',
  }

  return (
    <AntButton
      type={mapVariante[variante] ?? 'primary'}
      danger={variante === 'danger'}
      size={tamanho}
      loading={carregando}
      {...props}
    >
      {children}
    </AntButton>
  )
}

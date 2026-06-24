import { Spin } from 'antd'

const tamanhos = { sm: 'small', md: 'default', lg: 'large' }

export function Loading({ tamanho = 'md', fullscreen = false }) {
  if (fullscreen) {
    return (
      <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', zIndex: 9999 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
      <Spin size={tamanhos[tamanho] ?? 'default'} />
    </div>
  )
}

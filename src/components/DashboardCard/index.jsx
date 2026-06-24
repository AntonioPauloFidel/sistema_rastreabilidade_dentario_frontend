import { Card, Statistic } from 'antd'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

const cores = {
  verde: { border: '#038C5A', icon: '#038C5A', bg: '#f0fdf8' },
  accent: { border: '#05F29B', icon: '#038C5A', bg: '#e6fff5' },
  amarelo: { border: '#d97706', icon: '#d97706', bg: '#fffbeb' },
  vermelho: { border: '#dc2626', icon: '#dc2626', bg: '#fef2f2' },
}

export function DashboardCard({ titulo, valor, icone, variacao, cor = 'verde', onClick }) {
  const tema = cores[cor] ?? cores.verde
  const positivo = variacao >= 0

  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      style={{ borderTop: `4px solid ${tema.border}`, background: tema.bg, cursor: onClick ? 'pointer' : 'default' }}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Statistic
          title={<span style={{ color: '#6b7280', fontSize: 13 }}>{titulo}</span>}
          value={valor}
          valueStyle={{ color: tema.border, fontWeight: 700, fontSize: 28 }}
        />
        {icone && (
          <div style={{ fontSize: 28, color: tema.icon, opacity: 0.8 }}>
            {icone}
          </div>
        )}
      </div>
      {variacao !== undefined && (
        <div style={{ marginTop: 8, fontSize: 13, color: positivo ? '#038C5A' : '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
          {positivo ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
          <span>{Math.abs(variacao)}% em relação ao mês anterior</span>
        </div>
      )}
    </Card>
  )
}

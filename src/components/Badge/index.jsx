import { Tag } from 'antd'
import { STATUS_DENTE, STATUS_SOLICITACAO } from '../../constants/enums'

export function Badge({ status, tipo = 'dente' }) {
  const mapa = tipo === 'solicitacao' ? STATUS_SOLICITACAO : STATUS_DENTE
  const config = mapa[status] ?? { label: status, cor: 'default' }

  return <Tag color={config.cor}>{config.label}</Tag>
}

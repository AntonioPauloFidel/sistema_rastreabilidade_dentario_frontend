import { Empty, Button } from 'antd'

export function EmptyState({ mensagem = 'Nenhum registro encontrado', acao }) {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <Empty
        description={<span style={{ color: '#6b7280' }}>{mensagem}</span>}
      />
      {acao && (
        <Button
          type="primary"
          onClick={acao.onClick}
          style={{ marginTop: 16, background: '#038C5A', borderColor: '#038C5A' }}
        >
          {acao.label}
        </Button>
      )}
    </div>
  )
}

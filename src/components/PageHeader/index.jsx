import { Button } from 'antd'

export function PageHeader({ titulo, subtitulo, acaoPrincipal }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#038C5A', margin: 0 }}>{titulo}</h1>
        {subtitulo && <p style={{ color: '#6b7280', marginTop: 4, marginBottom: 0, fontSize: 14 }}>{subtitulo}</p>}
      </div>
      {acaoPrincipal && (
        <Button
          type="primary"
          onClick={acaoPrincipal.onClick}
          style={{ background: '#038C5A', borderColor: '#038C5A' }}
        >
          {acaoPrincipal.label}
        </Button>
      )}
    </div>
  )
}

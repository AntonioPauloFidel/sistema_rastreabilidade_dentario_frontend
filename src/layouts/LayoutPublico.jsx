import { Outlet } from 'react-router-dom'

export function LayoutPublico() {
  return (
    <div style={{ minHeight: '100vh', background: '#F2F2F2', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ color: '#038C5A', fontSize: 32, fontWeight: 800, letterSpacing: 2, margin: 0 }}>SIRDE</h1>
        <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>Sistema de Repositório de Dentes</p>
      </div>
      <Outlet />
    </div>
  )
}

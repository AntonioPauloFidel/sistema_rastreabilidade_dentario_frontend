import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Breadcrumb } from '../components/Breadcrumb'

export function LayoutAutenticado() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F2F2' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', minWidth: 0 }}>
        <Breadcrumb />
        <Outlet />
      </main>
    </div>
  )
}

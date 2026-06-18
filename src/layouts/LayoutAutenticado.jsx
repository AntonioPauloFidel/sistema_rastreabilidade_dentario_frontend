import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Breadcrumb } from '../components/Breadcrumb'

export function LayoutAutenticado() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F2F2F2' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
          <Breadcrumb />
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}

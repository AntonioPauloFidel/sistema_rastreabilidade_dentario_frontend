import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import { Breadcrumb } from '../components/Breadcrumb'

const { Header, Content } = Layout

export function LayoutAutenticado() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#F2F2F2' }}>
      <Header style={{ background: '#038C5A', padding: '0 24px', display: 'flex', alignItems: 'center' }}>
        <span style={{ color: '#fff', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>SIRDE</span>
      </Header>
      <Content style={{ maxWidth: 1280, width: '100%', margin: '0 auto', padding: '24px 24px' }}>
        <Breadcrumb />
        <Outlet />
      </Content>
    </Layout>
  )
}

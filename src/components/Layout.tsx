import React from 'react'
import { Layout as AntLayout } from 'antd'
import Sidebar from './Sidebar'

const { Sider, Content } = AntLayout

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark" collapsible>
        <div style={{ height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
          📈 Stock Assistant
        </div>
        <Sidebar />
      </Sider>
      <AntLayout>
        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: '100vh' }}>
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )
}

export default Layout

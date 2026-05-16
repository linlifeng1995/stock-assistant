import React from 'react'
import { Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  CalendarOutlined,
  HistoryOutlined,
  BookOutlined,
  SettingOutlined,
} from '@ant-design/icons'

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/daily-plans', icon: <CalendarOutlined />, label: 'Daily Plans' },
  { key: '/trade-logs', icon: <HistoryOutlined />, label: 'Trade Logs' },
  { key: '/daily-review', icon: <BookOutlined />, label: 'Daily Review' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
]

const Sidebar: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
    />
  )
}

export default Sidebar

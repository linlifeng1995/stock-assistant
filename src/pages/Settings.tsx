import React, { useEffect, useState } from 'react'
import {
  Card, Form, InputNumber, Switch, Select, Button, Typography, message, Spin, Divider
} from 'antd'
import { BellOutlined } from '@ant-design/icons'
import type { AppSettings } from '../types'

const { Title, Text } = Typography

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    window.electronAPI.getSettings().then(s => {
      form.setFieldsValue(s)
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    const values = await form.validateFields()
    setSaving(true)
    try {
      await window.electronAPI.updateSettings(values as Partial<AppSettings>)
      message.success('Settings saved')
    } finally {
      setSaving(false)
    }
  }

  const sendTestNotification = async () => {
    await window.electronAPI.sendNotification('Stock Assistant', 'This is a test notification from Stock Assistant!')
    message.success('Test notification sent')
  }

  if (loading) return <Spin size="large" style={{ marginTop: 80, display: 'block' }} />

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Settings</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical">
          <Form.Item name="polling_interval" label="Polling Interval (seconds)">
            <InputNumber min={5} max={300} style={{ width: '100%' }} />
          </Form.Item>
          <Text type="secondary">How often to check for price alerts (placeholder, not yet active).</Text>

          <Divider />

          <Form.Item name="notifications_enabled" label="Enable Notifications" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider />

          <Form.Item name="watchlist_input_mode" label="Watchlist Input Mode">
            <Select options={[
              { value: 'manual', label: 'Manual Entry' },
              { value: 'import', label: 'Import from File' },
            ]} />
          </Form.Item>

          <Divider />

          <Form.Item name="data_source" label="Data Source (Placeholder)">
            <Select options={[
              { value: 'none', label: 'None (Local Only)' },
              { value: 'tushare', label: 'Tushare (coming soon)' },
              { value: 'akshare', label: 'AKShare (coming soon)' },
            ]} />
          </Form.Item>
          <Text type="secondary">External data sources are not yet integrated. This is a placeholder for future configuration.</Text>

          <Divider />

          <Form.Item>
            <Button type="primary" onClick={handleSave} loading={saving}>Save Settings</Button>
          </Form.Item>
        </Form>

        <Divider />

        <div>
          <Title level={5}><BellOutlined /> Notifications Test</Title>
          <Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
            Send a test desktop notification to verify notifications are working.
          </Text>
          <Button icon={<BellOutlined />} onClick={sendTestNotification}>
            Send Test Notification
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Settings

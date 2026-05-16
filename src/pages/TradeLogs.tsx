import React, { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber, Select, Switch,
  Space, Popconfirm, Typography, Tag, message, DatePicker
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { TradeLog } from '../types'
import dayjs from 'dayjs'

const { Title } = Typography

const TradeLogs: React.FC = () => {
  const [logs, setLogs] = useState<TradeLog[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<TradeLog | null>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      setLogs(await window.electronAPI.listTradeLogs())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ side: 'buy', planned: false, trade_time: dayjs() })
    setModalOpen(true)
  }

  const openEdit = (log: TradeLog) => {
    setEditing(log)
    form.setFieldsValue({ ...log, planned: log.planned === 1, trade_time: dayjs(log.trade_time) })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const payload = {
      ...values,
      planned: values.planned ? 1 : 0,
      trade_time: values.trade_time.toISOString(),
    }
    if (editing) {
      await window.electronAPI.updateTradeLog(editing.id, payload)
      message.success('Trade log updated')
    } else {
      await window.electronAPI.createTradeLog(payload)
      message.success('Trade log created')
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    await window.electronAPI.deleteTradeLog(id)
    message.success('Trade log deleted')
    load()
  }

  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol', render: (v: string) => <strong>{v}</strong> },
    { title: 'Side', dataIndex: 'side', key: 'side', render: (v: string) => <Tag color={v === 'buy' ? 'green' : 'red'}>{v.toUpperCase()}</Tag> },
    { title: 'Price', dataIndex: 'price', key: 'price' },
    { title: 'Qty', dataIndex: 'quantity', key: 'quantity' },
    { title: 'PnL', dataIndex: 'pnl', key: 'pnl', render: (v: number) => v != null ? <span style={{ color: v >= 0 ? 'green' : 'red' }}>{v}</span> : '-' },
    { title: 'Pattern', dataIndex: 'pattern', key: 'pattern' },
    { title: 'Planned', dataIndex: 'planned', key: 'planned', render: (v: number) => v === 1 ? <Tag color="blue">Yes</Tag> : <Tag>No</Tag> },
    { title: 'Trade Time', dataIndex: 'trade_time', key: 'trade_time', render: (v: string) => v.slice(0, 16) },
    {
      title: 'Actions', key: 'actions', render: (_: unknown, record: TradeLog) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this trade log?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Trade Logs</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Trade</Button>
      </div>
      <Table columns={columns} dataSource={logs} rowKey="id" loading={loading} />

      <Modal
        title={editing ? 'Edit Trade Log' : 'New Trade Log'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
            <Input placeholder="e.g. AAPL" />
          </Form.Item>
          <Form.Item name="side" label="Side" rules={[{ required: true }]}>
            <Select options={[{ value: 'buy', label: 'Buy' }, { value: 'sell', label: 'Sell' }]} />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="quantity" label="Quantity" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="pnl" label="PnL">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="reason" label="Reason">
            <Input.TextArea rows={2} placeholder="Why did you make this trade?" />
          </Form.Item>
          <Form.Item name="pattern" label="Pattern/Tag">
            <Input placeholder="e.g. breakout, pullback, momentum" />
          </Form.Item>
          <Form.Item name="planned" label="Planned Trade" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="trade_time" label="Trade Time" rules={[{ required: true }]}>
            <DatePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default TradeLogs

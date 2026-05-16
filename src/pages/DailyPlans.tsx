import React, { useEffect, useState } from 'react'
import {
  Table, Button, Modal, Form, Input, InputNumber, Switch,
  Space, Popconfirm, Typography, Tag, message
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import type { DailyPlan } from '../types'

const { Title } = Typography

const DailyPlans: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DailyPlan | null>(null)
  const [form] = Form.useForm()

  const load = async () => {
    setLoading(true)
    try {
      setPlans(await window.electronAPI.listDailyPlans())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ active: true })
    setModalOpen(true)
  }

  const openEdit = (plan: DailyPlan) => {
    setEditing(plan)
    form.setFieldsValue({ ...plan, active: plan.active === 1 })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    const payload = { ...values, active: values.active ? 1 : 0 }
    if (editing) {
      await window.electronAPI.updateDailyPlan(editing.id, payload)
      message.success('Plan updated')
    } else {
      await window.electronAPI.createDailyPlan(payload)
      message.success('Plan created')
    }
    setModalOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    await window.electronAPI.deleteDailyPlan(id)
    message.success('Plan deleted')
    load()
  }

  const columns = [
    { title: 'Symbol', dataIndex: 'symbol', key: 'symbol', render: (v: string) => <strong>{v}</strong> },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Buy Trigger', dataIndex: 'buy_trigger', key: 'buy_trigger' },
    { title: 'Stop Loss', dataIndex: 'stop_loss', key: 'stop_loss', render: (v: number) => v != null ? v : '-' },
    { title: 'Take Profit', dataIndex: 'take_profit', key: 'take_profit', render: (v: number) => v != null ? v : '-' },
    { title: 'Note', dataIndex: 'note', key: 'note', ellipsis: true },
    { title: 'Status', dataIndex: 'active', key: 'active', render: (v: number) => v === 1 ? <Tag color="green">Active</Tag> : <Tag>Inactive</Tag> },
    {
      title: 'Actions', key: 'actions', render: (_: unknown, record: DailyPlan) => (
        <Space>
          <Button icon={<EditOutlined />} size="small" onClick={() => openEdit(record)}>Edit</Button>
          <Popconfirm title="Delete this plan?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Daily Plans</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>New Plan</Button>
      </div>
      <Table columns={columns} dataSource={plans} rowKey="id" loading={loading} />

      <Modal
        title={editing ? 'Edit Plan' : 'New Plan'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="symbol" label="Symbol" rules={[{ required: true, message: 'Symbol required' }]}>
            <Input placeholder="e.g. AAPL" />
          </Form.Item>
          <Form.Item name="name" label="Name/Alias">
            <Input placeholder="e.g. Apple Inc" />
          </Form.Item>
          <Form.Item name="buy_trigger" label="Buy Trigger">
            <Input.TextArea rows={2} placeholder="Describe the buy trigger condition" />
          </Form.Item>
          <Form.Item name="stop_loss" label="Stop Loss">
            <InputNumber style={{ width: '100%' }} placeholder="e.g. 150.00" />
          </Form.Item>
          <Form.Item name="take_profit" label="Take Profit">
            <InputNumber style={{ width: '100%' }} placeholder="e.g. 170.00" />
          </Form.Item>
          <Form.Item name="note" label="Note">
            <Input.TextArea rows={3} placeholder="Additional notes" />
          </Form.Item>
          <Form.Item name="active" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default DailyPlans

import React, { useState, useEffect } from 'react'
import { DatePicker, Button, Form, Input, Typography, Card, Space, message, Spin } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import type { DailyReview as DailyReviewType } from '../types'

const { Title } = Typography

const DailyReview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm()

  const loadReview = async (date: Dayjs) => {
    setLoading(true)
    try {
      const r = await window.electronAPI.getDailyReviewByDate(date.format('YYYY-MM-DD'))
      form.setFieldsValue({
        summary: r?.summary || '',
        mistakes: r?.mistakes || '',
        improvements: r?.improvements || '',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadReview(selectedDate) }, [])

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSelectedDate(date)
      loadReview(date)
    }
  }

  const handleSave = async () => {
    const values = await form.validateFields()
    setSaving(true)
    try {
      await window.electronAPI.upsertDailyReview({
        review_date: selectedDate.format('YYYY-MM-DD'),
        ...values,
      })
      message.success('Review saved')
      loadReview(selectedDate)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Daily Review</Title>
        <DatePicker value={selectedDate} onChange={handleDateChange} allowClear={false} />
      </div>

      {loading ? <Spin /> : (
        <Card title={`Review for ${selectedDate.format('YYYY-MM-DD')}`}>
          <Form form={form} layout="vertical">
            <Form.Item name="summary" label="Summary">
              <Input.TextArea rows={4} placeholder="What happened today? Key observations?" />
            </Form.Item>
            <Form.Item name="mistakes" label="Mistakes">
              <Input.TextArea rows={4} placeholder="What mistakes did you make? What went wrong?" />
            </Form.Item>
            <Form.Item name="improvements" label="Improvements">
              <Input.TextArea rows={4} placeholder="What will you do better tomorrow?" />
            </Form.Item>
            <Space>
              <Button type="primary" onClick={handleSave} loading={saving}>Save Review</Button>
            </Space>
          </Form>
        </Card>
      )}
    </div>
  )
}

export default DailyReview

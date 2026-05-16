import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Statistic, Typography, Tag, Spin } from 'antd'
import { CalendarOutlined, HistoryOutlined, BookOutlined, BellOutlined, ApiOutlined } from '@ant-design/icons'
import type { DailyPlan, TradeLog, DailyReview } from '../types'

const { Title, Text } = Typography

const Dashboard: React.FC = () => {
  const [plans, setPlans] = useState<DailyPlan[]>([])
  const [logs, setLogs] = useState<TradeLog[]>([])
  const [latestReview, setLatestReview] = useState<DailyReview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [p, l, reviews] = await Promise.all([
          window.electronAPI.listDailyPlans(),
          window.electronAPI.listTradeLogs(),
          window.electronAPI.listDailyReviews(),
        ])
        setPlans(p)
        setLogs(l)
        setLatestReview(reviews[0] || null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <Spin size="large" style={{ marginTop: 80, display: 'block' }} />

  const today = new Date().toISOString().slice(0, 10)
  const todayActivePlans = plans.filter(p => p.active === 1)
  const recentLogs = logs.filter(l => l.trade_time.startsWith(today))

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Active Plans"
              value={todayActivePlans.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Today's Trades"
              value={recentLogs.length}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Total Trade Logs"
              value={logs.length}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card hoverable>
            <Statistic
              title="Total Plans"
              value={plans.length}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={12}>
          <Card
            title={<><BookOutlined /> Latest Review</>}
            extra={latestReview ? <Tag color="green">{latestReview.review_date}</Tag> : <Tag>No reviews yet</Tag>}
          >
            {latestReview ? (
              <Text>{latestReview.summary || 'No summary written.'}</Text>
            ) : (
              <Text type="secondary">No daily review yet. Go to Daily Review to write one.</Text>
            )}
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title={<><BellOutlined /> Price Reminders</>}>
            <Text type="secondary">Price reminder feature coming soon. Set alerts from Settings.</Text>
          </Card>
        </Col>
        <Col xs={24} md={6}>
          <Card title={<><ApiOutlined /> Data Source</>}>
            <Text type="secondary">External data source not configured. Configure in Settings.</Text>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

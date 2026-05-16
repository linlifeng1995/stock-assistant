import React from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import DailyPlans from './pages/DailyPlans'
import TradeLogs from './pages/TradeLogs'
import DailyReview from './pages/DailyReview'
import Settings from './pages/Settings'

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/daily-plans" element={<DailyPlans />} />
          <Route path="/trade-logs" element={<TradeLogs />} />
          <Route path="/daily-review" element={<DailyReview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}

export default App

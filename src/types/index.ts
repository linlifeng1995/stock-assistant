export interface DailyPlan {
  id: number
  symbol: string
  name: string | null
  buy_trigger: string | null
  stop_loss: number | null
  take_profit: number | null
  note: string | null
  active: number // 1 = active, 0 = inactive
  created_at: string
  updated_at: string
}

export interface TradeLog {
  id: number
  symbol: string
  side: 'buy' | 'sell'
  price: number
  quantity: number
  reason: string | null
  pattern: string | null
  planned: number // 1 = planned, 0 = unplanned
  pnl: number | null
  note: string | null
  trade_time: string
  created_at: string
  updated_at: string
}

export interface DailyReview {
  id: number
  review_date: string
  summary: string | null
  mistakes: string | null
  improvements: string | null
  created_at: string
  updated_at: string
}

export interface AppSettings {
  polling_interval: number
  notifications_enabled: boolean
  watchlist_input_mode: 'manual' | 'import'
  data_source: string
}

export interface ElectronAPI {
  // Daily Plans
  listDailyPlans: () => Promise<DailyPlan[]>
  createDailyPlan: (plan: Omit<DailyPlan, 'id' | 'created_at' | 'updated_at'>) => Promise<DailyPlan>
  updateDailyPlan: (id: number, plan: Partial<DailyPlan>) => Promise<DailyPlan>
  deleteDailyPlan: (id: number) => Promise<void>

  // Trade Logs
  listTradeLogs: () => Promise<TradeLog[]>
  createTradeLog: (log: Omit<TradeLog, 'id' | 'created_at' | 'updated_at'>) => Promise<TradeLog>
  updateTradeLog: (id: number, log: Partial<TradeLog>) => Promise<TradeLog>
  deleteTradeLog: (id: number) => Promise<void>

  // Daily Reviews
  listDailyReviews: () => Promise<DailyReview[]>
  getDailyReviewByDate: (date: string) => Promise<DailyReview | null>
  upsertDailyReview: (review: Omit<DailyReview, 'id' | 'created_at' | 'updated_at'>) => Promise<DailyReview>

  // Settings
  getSettings: () => Promise<AppSettings>
  updateSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>

  // Notifications
  sendNotification: (title: string, body: string) => Promise<void>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

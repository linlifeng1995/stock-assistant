import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  listDailyPlans: () => ipcRenderer.invoke('dailyPlans:list'),
  createDailyPlan: (plan: unknown) => ipcRenderer.invoke('dailyPlans:create', plan),
  updateDailyPlan: (id: number, plan: unknown) => ipcRenderer.invoke('dailyPlans:update', id, plan),
  deleteDailyPlan: (id: number) => ipcRenderer.invoke('dailyPlans:delete', id),

  listTradeLogs: () => ipcRenderer.invoke('tradeLogs:list'),
  createTradeLog: (log: unknown) => ipcRenderer.invoke('tradeLogs:create', log),
  updateTradeLog: (id: number, log: unknown) => ipcRenderer.invoke('tradeLogs:update', id, log),
  deleteTradeLog: (id: number) => ipcRenderer.invoke('tradeLogs:delete', id),

  listDailyReviews: () => ipcRenderer.invoke('dailyReviews:list'),
  getDailyReviewByDate: (date: string) => ipcRenderer.invoke('dailyReviews:getByDate', date),
  upsertDailyReview: (review: unknown) => ipcRenderer.invoke('dailyReviews:upsert', review),

  getSettings: () => ipcRenderer.invoke('settings:get'),
  updateSettings: (settings: unknown) => ipcRenderer.invoke('settings:update', settings),

  sendNotification: (title: string, body: string) => ipcRenderer.invoke('notification:send', title, body),
})

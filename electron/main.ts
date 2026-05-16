import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import path from 'path'
import { getDatabase } from './db/database'
import * as dailyPlansRepo from './db/repositories/dailyPlans'
import * as tradeLogsRepo from './db/repositories/tradeLogs'
import * as dailyReviewsRepo from './db/repositories/dailyReviews'
import * as settingsRepo from './db/repositories/settings'

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'Stock Assistant',
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    win.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

function registerIpcHandlers(): void {
  getDatabase()

  ipcMain.handle('dailyPlans:list', () => dailyPlansRepo.listDailyPlans())
  ipcMain.handle('dailyPlans:create', (_event, plan) => dailyPlansRepo.createDailyPlan(plan))
  ipcMain.handle('dailyPlans:update', (_event, id, plan) => dailyPlansRepo.updateDailyPlan(id, plan))
  ipcMain.handle('dailyPlans:delete', (_event, id) => dailyPlansRepo.deleteDailyPlan(id))

  ipcMain.handle('tradeLogs:list', () => tradeLogsRepo.listTradeLogs())
  ipcMain.handle('tradeLogs:create', (_event, log) => tradeLogsRepo.createTradeLog(log))
  ipcMain.handle('tradeLogs:update', (_event, id, log) => tradeLogsRepo.updateTradeLog(id, log))
  ipcMain.handle('tradeLogs:delete', (_event, id) => tradeLogsRepo.deleteTradeLog(id))

  ipcMain.handle('dailyReviews:list', () => dailyReviewsRepo.listDailyReviews())
  ipcMain.handle('dailyReviews:getByDate', (_event, date) => dailyReviewsRepo.getDailyReviewByDate(date))
  ipcMain.handle('dailyReviews:upsert', (_event, review) => dailyReviewsRepo.upsertDailyReview(review))

  ipcMain.handle('settings:get', () => settingsRepo.getSettings())
  ipcMain.handle('settings:update', (_event, settings) => settingsRepo.updateSettings(settings))

  ipcMain.handle('notification:send', (_event, title: string, body: string) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show()
    }
  })
}

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

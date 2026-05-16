import { getDatabase } from '../database'
import { TradeLog } from '../../../src/types'

export function listTradeLogs(): TradeLog[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM trade_logs ORDER BY trade_time DESC').all() as TradeLog[]
}

export function createTradeLog(log: Omit<TradeLog, 'id' | 'created_at' | 'updated_at'>): TradeLog {
  const db = getDatabase()
  const result = db.prepare(`
    INSERT INTO trade_logs (symbol, side, price, quantity, reason, pattern, planned, pnl, note, trade_time)
    VALUES (@symbol, @side, @price, @quantity, @reason, @pattern, @planned, @pnl, @note, @trade_time)
  `).run(log)
  return db.prepare('SELECT * FROM trade_logs WHERE id = ?').get(result.lastInsertRowid) as TradeLog
}

export function updateTradeLog(id: number, log: Partial<TradeLog>): TradeLog {
  const db = getDatabase()
  const fields = Object.keys(log).filter(k => k !== 'id' && k !== 'created_at')
  const setClause = fields.map(f => `${f} = @${f}`).join(', ')
  db.prepare(`UPDATE trade_logs SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run({ ...log, id })
  return db.prepare('SELECT * FROM trade_logs WHERE id = ?').get(id) as TradeLog
}

export function deleteTradeLog(id: number): void {
  const db = getDatabase()
  db.prepare('DELETE FROM trade_logs WHERE id = ?').run(id)
}

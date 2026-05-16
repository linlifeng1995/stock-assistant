import { getDatabase } from '../database'
import { DailyPlan } from '../../../src/types'

export function listDailyPlans(): DailyPlan[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM daily_plans ORDER BY created_at DESC').all() as DailyPlan[]
}

export function createDailyPlan(plan: Omit<DailyPlan, 'id' | 'created_at' | 'updated_at'>): DailyPlan {
  const db = getDatabase()
  const result = db.prepare(`
    INSERT INTO daily_plans (symbol, name, buy_trigger, stop_loss, take_profit, note, active)
    VALUES (@symbol, @name, @buy_trigger, @stop_loss, @take_profit, @note, @active)
  `).run(plan)
  return db.prepare('SELECT * FROM daily_plans WHERE id = ?').get(result.lastInsertRowid) as DailyPlan
}

export function updateDailyPlan(id: number, plan: Partial<DailyPlan>): DailyPlan {
  const db = getDatabase()
  const fields = Object.keys(plan).filter(k => k !== 'id' && k !== 'created_at')
  const setClause = fields.map(f => `${f} = @${f}`).join(', ')
  db.prepare(`UPDATE daily_plans SET ${setClause}, updated_at = datetime('now') WHERE id = @id`).run({ ...plan, id })
  return db.prepare('SELECT * FROM daily_plans WHERE id = ?').get(id) as DailyPlan
}

export function deleteDailyPlan(id: number): void {
  const db = getDatabase()
  db.prepare('DELETE FROM daily_plans WHERE id = ?').run(id)
}

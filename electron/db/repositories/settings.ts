import { getDatabase } from '../database'
import { AppSettings } from '../../../src/types'

export function getSettings(): AppSettings {
  const db = getDatabase()
  const rows = db.prepare('SELECT key, value FROM settings').all() as { key: string; value: string }[]
  const map: Record<string, string> = {}
  rows.forEach(r => { map[r.key] = r.value })
  return {
    polling_interval: parseInt(map['polling_interval'] || '30'),
    notifications_enabled: map['notifications_enabled'] === 'true',
    watchlist_input_mode: (map['watchlist_input_mode'] || 'manual') as AppSettings['watchlist_input_mode'],
    data_source: map['data_source'] || 'none',
  }
}

export function updateSettings(settings: Partial<AppSettings>): AppSettings {
  const db = getDatabase()
  const update = db.prepare(`INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, datetime('now'))`)
  const updateMany = db.transaction((s: Partial<AppSettings>) => {
    Object.entries(s).forEach(([key, value]) => {
      update.run(key, String(value))
    })
  })
  updateMany(settings)
  return getSettings()
}

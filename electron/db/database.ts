import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'

let db: Database.Database

export function getDatabase(): Database.Database {
  if (!db) {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'stock-assistant.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initSchema(db)
  }
  return db
}

function initSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_plans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      name TEXT,
      buy_trigger TEXT,
      stop_loss REAL,
      take_profit REAL,
      note TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS trade_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      symbol TEXT NOT NULL,
      side TEXT NOT NULL CHECK(side IN ('buy', 'sell')),
      price REAL NOT NULL,
      quantity REAL NOT NULL,
      reason TEXT,
      pattern TEXT,
      planned INTEGER NOT NULL DEFAULT 0,
      pnl REAL,
      note TEXT,
      trade_time TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS daily_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      review_date TEXT NOT NULL UNIQUE,
      summary TEXT,
      mistakes TEXT,
      improvements TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)

  const insert = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)
  `)
  insert.run('polling_interval', '30')
  insert.run('notifications_enabled', 'true')
  insert.run('watchlist_input_mode', 'manual')
  insert.run('data_source', 'none')
}

import { getDatabase } from '../database'
import { DailyReview } from '../../../src/types'

export function listDailyReviews(): DailyReview[] {
  const db = getDatabase()
  return db.prepare('SELECT * FROM daily_reviews ORDER BY review_date DESC').all() as DailyReview[]
}

export function getDailyReviewByDate(date: string): DailyReview | null {
  const db = getDatabase()
  return db.prepare('SELECT * FROM daily_reviews WHERE review_date = ?').get(date) as DailyReview | null
}

export function upsertDailyReview(review: Omit<DailyReview, 'id' | 'created_at' | 'updated_at'>): DailyReview {
  const db = getDatabase()
  db.prepare(`
    INSERT INTO daily_reviews (review_date, summary, mistakes, improvements)
    VALUES (@review_date, @summary, @mistakes, @improvements)
    ON CONFLICT(review_date) DO UPDATE SET
      summary = excluded.summary,
      mistakes = excluded.mistakes,
      improvements = excluded.improvements,
      updated_at = datetime('now')
  `).run(review)
  return db.prepare('SELECT * FROM daily_reviews WHERE review_date = ?').get(review.review_date) as DailyReview
}

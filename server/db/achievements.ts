import db from '../db/connection'
import type { Achievement } from '../../models/types'

export async function getAchievementsByUserId(userId: string): Promise<Achievement[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM achievements WHERE user_id = ?',
    args: [userId],
  })
  return result.rows as unknown as Achievement[]
}

export async function hasAchievement(userId: string, type: string): Promise<boolean> {
  const result = await db.execute({
    sql: 'SELECT 1 FROM achievements WHERE user_id = ? AND type = ? LIMIT 1',
    args: [userId, type],
  })
  return result.rows.length > 0
}

export async function insertAchievement(userId: string, type: string, name: string): Promise<Achievement> {
  const result = await db.execute({
    sql: `INSERT INTO achievements (user_id, type, name, unlocked_at) 
          VALUES (?, ?, ?, CURRENT_TIMESTAMP) 
          RETURNING *`,
    args: [userId, type, name],
  })
  return result.rows[0] as unknown as Achievement
}

export async function getCardCount(userId: string): Promise<number> {
  const result = await db.execute({
    sql: 'SELECT COUNT(*) as count FROM cards WHERE user_id = ?',
    args: [userId],
  })
  const row = result.rows[0] as unknown as { count: number | string }
  return Number(row?.count ?? 0)
}

export async function hasCardOfType(userId: string, type: string): Promise<boolean> {
  const result = await db.execute({
    sql: `SELECT 1 FROM cards 
          JOIN species ON cards.species_id = species.id 
          WHERE cards.user_id = ? AND species.type = ? 
          LIMIT 1`,
    args: [userId, type],
  })
  return result.rows.length > 0
}

export async function hasLegendaryCard(userId: string): Promise<boolean> {
  const result = await db.execute({
    sql: `SELECT 1 FROM cards 
          JOIN species ON cards.species_id = species.id 
          WHERE cards.user_id = ? AND species.rarity = 'legendary' 
          LIMIT 1`,
    args: [userId],
  })
  return result.rows.length > 0
}
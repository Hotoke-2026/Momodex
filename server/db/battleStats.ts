import db from './connection'
import type { BattleStats } from '../../models/types'

async function ensureUserExists(userId: string) {
  const existingUser = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [userId],
  })

  if (existingUser.rows.length === 0) {
    await db.execute({
      sql: 'INSERT INTO users (id, name) VALUES (?, ?)',
      args: [userId, userId],
    })
  }
}

export async function getOrCreateBattleStats(userId: string): Promise<BattleStats> {
  await ensureUserExists(userId)

  let result = await db.execute({
    sql: 'SELECT * FROM battle_stats WHERE user_id = ?',
    args: [userId],
  })

  let stats = result.rows[0] as unknown as BattleStats

  if (!stats) {
    const insertResult = await db.execute({
      sql: 'INSERT INTO battle_stats (user_id, wins, losses) VALUES (?, 0, 0) RETURNING *',
      args: [userId],
    })
    stats = insertResult.rows[0] as unknown as BattleStats
  }
  return stats
}

export async function recordBattleOutcome(userId: string, won: boolean): Promise<BattleStats> {
  await getOrCreateBattleStats(userId)
  const column = won ? 'wins' : 'losses'
  
  const result = await db.execute({
    sql: `UPDATE battle_stats SET ${column} = ${column} + 1 WHERE user_id = ? RETURNING *`,
    args: [userId],
  })
  
  return result.rows[0] as unknown as BattleStats
}
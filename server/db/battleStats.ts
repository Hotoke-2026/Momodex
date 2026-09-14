import db from './connection'
import type { BattleStats } from '../../models/types'

export async function getOrCreateBattleStats(userId: string): Promise<BattleStats> {
  let stats = await db('battle_stats').where({ user_id: userId }).first()
  if (!stats) {
    ;[stats] = await db('battle_stats').insert({ user_id: userId }).returning('*')
  }
  return stats
}

export async function recordBattleOutcome(userId: string, won: boolean): Promise<BattleStats> {
  await getOrCreateBattleStats(userId)
  const column = won ? 'wins' : 'losses'
  const [stats] = await db('battle_stats').where({ user_id: userId }).increment(column, 1).returning('*')
  return stats
}
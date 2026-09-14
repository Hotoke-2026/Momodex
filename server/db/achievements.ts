import db from './connection'
import type { Achievement } from '../../models/types'

export async function getAchievementsByUserId(userId: string): Promise<Achievement[]> {
  return db('achievements').where({ user_id: userId })
}

export async function hasAchievement(userId: string, type: string): Promise<boolean> {
  const row = await db('achievements').where({ user_id: userId, type }).first()
  return Boolean(row)
}

export async function insertAchievement(
  userId: string,
  type: string,
  name: string,
): Promise<Achievement> {
  const id = `${userId}-${type}`
  const [achievement] = await db('achievements')
    .insert({ id, user_id: userId, type, name })
    .onConflict('id')
    .ignore()
    .returning('*')

  return achievement
}

export async function getFirstCardSpeciesType(userId: string): Promise<string | null> {
  const row = await db('cards')
    .join('species', 'cards.species_id', 'species.id')
    .where('cards.user_id', userId)
    .orderBy('cards.created_at', 'asc')
    .select('species.type')
    .first()

  return row ? row.type : null
}

export async function getCardCount(userId: string): Promise<number> {
  const row = await db('cards').where({ user_id: userId }).count({ count: '*' }).first()
  return Number(row?.count ?? 0)
}

export async function hasLegendaryCard(userId: string): Promise<boolean> {
  const row = await db('cards')
    .join('species', 'cards.species_id', 'species.id')
    .where('cards.user_id', userId)
    .andWhere('species.rarity', 'legendary')
    .first()

  return Boolean(row)
}
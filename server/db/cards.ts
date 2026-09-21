// server/db/cards.ts
import db from './connection'
import { Card, NewCardPayload } from '../../models/types'

export async function getCardsByUserId(userId: string): Promise<Card[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM cards WHERE user_id = ?',
    args: [userId],
  })
  return result.rows as unknown as Card[]
}

export async function insertCard(newCard: NewCardPayload, userId: string): Promise<Card> {
  const result = await db.execute({
    sql: `
      INSERT INTO cards (user_id, card_name, species_id, image_url, location) 
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      userId,
      newCard.card_name,
      newCard.species_id,
      newCard.image_url,
      newCard.location || null,
    ],
  })

  const rawId = result.lastInsertRowid
  const newCardId = typeof rawId === 'bigint' || typeof rawId === 'number' ? Number(rawId) : NaN

  if (!Number.isFinite(newCardId)) {
    throw new Error('Invalid lastInsertRowid returned from database insert')
  }

  const fetchResult = await db.execute({
    sql: `SELECT * FROM cards WHERE id = ?`,
    args: [newCardId],
  })

  return fetchResult.rows[0] as unknown as Card
}
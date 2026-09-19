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
      RETURNING *
    `,
    args: [
      userId,
      newCard.card_name,
      newCard.species_id,
      newCard.image_url,
      newCard.location || null,
    ],
  })

  return result.rows[0] as unknown as Card
}
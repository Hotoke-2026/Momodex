import db from './connection'
import { Card, NewCardPayload } from '../../models/types'

export async function insertCard(newCard: NewCardPayload, userId: string): Promise<Card> {
  const [createdCard] = await db('cards')
    .insert({
      ...newCard,
      user_id: userId,
    })
    .returning('*')

  return createdCard
}
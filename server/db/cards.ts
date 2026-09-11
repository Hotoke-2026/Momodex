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

export async function getUserCards(auth0Id: string) {
  return db('cards')
    .where({ user_id: auth0Id })
    .select('*')
}
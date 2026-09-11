import request from 'superagent'
import { Card, NewCardPayload } from '../../models/types'

export async function fetchCards(token: string): Promise<Card[]> {
  const res = await request
    .get('/api/v1/cards')
    .set('Authorization', `Bearer ${token}`)
  return res.body
}

export async function addCard(newCard: NewCardPayload, token: string): Promise<Card> {
  const res = await request
    .post('/api/v1/cards')
    .set('Authorization', `Bearer ${token}`)
    .send(newCard)
  return res.body
}
import request from 'superagent'
import { Card, NewCardPayload } from '../../models/types'

const rootUrl = '/api/cards'

export async function addCard(newCard: NewCardPayload): Promise<Card> {
  const res = await request.post(rootUrl).send(newCard)
  return res.body
}
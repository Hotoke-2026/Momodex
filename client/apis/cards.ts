import request from 'superagent'
import type { Card, CardWithSpecies, NewCardPayload } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function fetchCards(token: string): Promise<Card[]> {
  const res = await request
    .get('/api/v1/cards')
    .set('Authorization', `Bearer ${token}`)
  return res.body
}

export async function addCard(newCard: NewCardPayload, token: string): Promise<Card> {
  const response = await request.post(`${rootURL}/cards`).set('Authorization', `Bearer ${token}`).send(newCard)
  return response.body
}

import request from 'superagent'
import type { Card, CardWithSpecies, NewCardPayload } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getCardsByUserId(userId: string) {
  const response = await request.get(`${rootURL}/cards`).query({ userId })
  return response.body as CardWithSpecies[]
}

export async function addCard(newCard: NewCardPayload): Promise<Card> {
  const response = await request.post(`${rootURL}/cards`).send(newCard)
  return response.body
}

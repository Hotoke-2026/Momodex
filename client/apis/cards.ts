// src/api/cards.ts
import request from 'superagent'
import type { CardWithSpecies } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getCardsByUserId(userId: string) {
  const response = await request.get(`${rootURL}/cards`).query({ userId })
  return response.body as CardWithSpecies[]
}

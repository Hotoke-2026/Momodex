import request from 'superagent'
import type { Card, CardWithSpecies, NewCardPayload } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getCardsByUserId(
  userId: string,
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })
  const response = await request
    .get(`${rootURL}/cards/${userId}`)
    .set('Authorization', `Bearer ${token}`)

  return response.body as CardWithSpecies[]
}

export async function addCard(
  newCard: NewCardPayload,
  getAccessTokenSilently: (options?: object) => Promise<string>,
): Promise<Card> {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })
  const response = await request
    .post(`${rootURL}/cards`)
    .send(newCard)
    .set('Authorization', `Bearer ${token}`)

  return response.body
}

// client/apis/cards.ts
export async function deleteCard(
  cardId: number,
  getAccessTokenSilently: () => Promise<string>,
) {
  const token = await getAccessTokenSilently()
  await request
    .delete(`${rootURL}/cards/${cardId}`)
    .set('Authorization', `Bearer ${token}`)
}

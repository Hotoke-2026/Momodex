import request from 'superagent'
import type { Card } from '../../models/types.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function identifyPhoto(
  imageUrl: string,
  userId: string,
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  try {
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: 'https://api.momodex.com',
      },
    })

    const response = await request
      .post(`${rootURL}/identify`)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ imageUrl, userId })

    return response.body as Card
  } catch (err: unknown) {
    const error = err as { response?: { body?: { error?: string } } }
    throw new Error(error.response?.body?.error || 'Request failed')
  }
}

export async function fetchUserById(
  userId: string,
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .get(`${rootURL}/users/${userId}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Accept', 'application/json')

  return response.body
}
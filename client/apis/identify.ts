import request from 'superagent'
import type { Card } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function identifyPhoto(
  fileOrUrl: File | string,
  userId: string,
  locationOrToken: string | ((options?: object) => Promise<string>),
  maybeToken?: (options?: object) => Promise<string>,
): Promise<Card> {
  try {
    if (fileOrUrl instanceof File) {
      const file = fileOrUrl
      const location = typeof locationOrToken === 'string' ? locationOrToken : undefined
      const getAccessTokenSilently = typeof locationOrToken === 'function' ? locationOrToken : maybeToken

      if (!getAccessTokenSilently) {
        throw new Error('Authentication function is required')
      }

      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: 'https://api.momodex.com',
        },
      })

      const req = request
        .post(`${rootURL}/identify`)
        .set('Authorization', `Bearer ${token}`)
        .attach('image', file)
        .field('userId', userId)

      if (location) {
        req.field('location', location)
      }

      const response = await req
      return response.body as Card
    } else {
      const imageUrl = fileOrUrl
      const getAccessTokenSilently = locationOrToken as (options?: object) => Promise<string>

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
    }
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
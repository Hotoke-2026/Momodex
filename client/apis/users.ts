import request from 'superagent'
import type { User } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUserById(
  id: string,
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .get(`${rootURL}/users/${id}`)
    .set('Authorization', `Bearer ${token}`)

  return response.body as User
}
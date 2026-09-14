import request from 'superagent'
import type { Species } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getAllSpecies(
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .get(`${rootURL}/species`)
    .set('Authorization', `Bearer ${token}`)
    
  return response.body as { id: string; name: string }[]
}

export async function getSpeciesById(
  id: string,
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .get(`${rootURL}/species/${id}`)
    .set('Authorization', `Bearer ${token}`)
    
  return response.body as Species
}
// client/apis/users.ts
import request from 'superagent'
import { BattleStats, FavouriteSpecies } from '../../models/types'


export interface User {
  id: string
  name: string
  avatar_url?: string | null
}

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUserById(id: string) {
  const response = await request.get(`${rootURL}/users/${id}`)
  return response.body as User
}



export async function getBattleStats(userId: string) {
  const response = await request.get(`${rootURL}/users/${userId}/battle-stats`)
  return response.body as BattleStats
}

export async function setFavouriteSpecies(userId: string, name: string) {
  const response = await request
    .patch(`${rootURL}/users/${userId}/favourite-species`)
    .send({ name })
  return response.body as User
}
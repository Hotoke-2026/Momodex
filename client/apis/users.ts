// client/apis/users.ts
import request from 'superagent'
import { BattleStats, FavouriteSpecies } from '../../models/types'

export interface User {
  id: string
  name: string
}

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUserById(id: string) {
  const response = await request.get(`${rootURL}/users/${id}`)
  return response.body as User
}

export interface User {
  id: string
  name: string
  avatar_url?: string | null
}

export async function getBattleStats(userId: string) {
  const response = await request.get(`${rootURL}/users/${userId}/battle-stats`)
  return response.body as BattleStats
}

export async function getFavouriteSpecies(userId: string) {
  const response = await request.get(`${rootURL}/users/${userId}/favourite-species`)
  return response.body as FavouriteSpecies | null
}
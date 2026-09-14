// client/apis/users.ts
import request from 'superagent'
import type { BattleStats, LastCapture } from '../../models/types'

export interface User {
  id: string
  name: string
  avatar_url?: string | null
  favourite_species?: string | null
  currently_seeking?: string | null
  created_at?: string
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

export async function getLastCapture(userId: string) {
  const response = await request.get(`${rootURL}/users/${userId}/last-capture`)
  return response.body as LastCapture | null
}

export interface ProfileFieldsUpdate {
  favourite_species?: string
  currently_seeking?: string
}

export async function updateProfileFields(userId: string, updates: ProfileFieldsUpdate) {
  const response = await request.patch(`${rootURL}/users/${userId}`).send(updates)
  return response.body as User
}
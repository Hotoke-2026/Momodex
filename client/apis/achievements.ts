import request from 'superagent'
import type { AchievementWithStatus, Achievement } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export interface CheckAchievementsPayload {
  winner?: 'player' | 'ai'
  opponentWasInvasive?: boolean
}

export async function getAchievements(
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .get(`${rootURL}/achievements`)
    .set('Authorization', `Bearer ${token}`)
  return response.body as AchievementWithStatus[]
}

export async function checkAchievements(
  { winner, opponentWasInvasive }: CheckAchievementsPayload,
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .post(`${rootURL}/achievements/check`)
    .send({ winner, opponentWasInvasive })
    .set('Authorization', `Bearer ${token}`)

  return response.body as Achievement[]
}
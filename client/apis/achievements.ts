import request from 'superagent'
import type { AchievementWithStatus, Achievement } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export interface CheckAchievementsPayload {
  userId: string
  winner?: 'player' | 'ai'
  opponentWasInvasive?: boolean
}

export async function getAchievements(userId: string) {
  const response = await request.get(`${rootURL}/achievements`).query({ userId })
  return response.body as AchievementWithStatus[]
}

export async function checkAchievements({
  userId,
  winner,
  opponentWasInvasive,
}: CheckAchievementsPayload) {
  const response = await request
    .post(`${rootURL}/achievements/check`)
    .send({ userId, winner, opponentWasInvasive })

  return response.body as Achievement[]
}
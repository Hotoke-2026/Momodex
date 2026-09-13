import request from 'superagent'
import type { AchievementWithStatus, Achievement } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getAchievements(userId: string) {
  const response = await request.get(`${rootURL}/achievements`).query({ userId })
  return response.body as AchievementWithStatus[]
}

export async function checkAchievements(userId: string) {
  const response = await request.post(`${rootURL}/achievements/check`).send({ userId })
  return response.body as Achievement[]
}
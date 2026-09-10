// src/api/identify.ts
import request from 'superagent'
import type { Card } from '../../models/types.ts'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function identifyPhoto(imageUrl: string, userId: string) {
  try {
    const response = await request
      .post(`${rootURL}/identify`)
      .send({ imageUrl, userId })
    return response.body as Card
  } catch (err: unknown) {
    const error = err as { response?: { body?: { error?: string } } }
    throw new Error(error.response?.body?.error || 'Request failed')
  }
}

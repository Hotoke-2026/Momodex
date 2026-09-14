//identify image using Gemini API
import request from 'superagent'
import type { Card } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function identifyPhoto(
  file: File,
  userId: string,
  location?: string,
) {
  const req = request
    .post(`${rootURL}/identify`)
    .attach('image', file) // field name MUST match multer's upload.single('image')
    .field('userId', userId)

  if (location) {
    req.field('location', location)
  }

  const response = await req
  return response.body as Card
}

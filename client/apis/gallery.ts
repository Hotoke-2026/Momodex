import request from 'superagent'
import type { GalleryImage } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getGalleryImages() {
  const response = await request.get(`${rootURL}/gallery`)
  return response.body.images as GalleryImage[]
}

export async function uploadImage(
  file: File,
  userId: string,
  caption?: string,
): Promise<GalleryImage> {
  const response = await request
    .post(`${rootURL}/gallery`)
    .field('user_id', userId)
    .field('caption', caption ?? '')
    .attach('image', file)

  return response.body
}

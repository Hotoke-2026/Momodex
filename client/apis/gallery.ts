import request from 'superagent'
import type { GalleryImage } from '../../models/types'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getGalleryImages(
  getAccessTokenSilently: (options?: object) => Promise<string>,
) {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .get(`${rootURL}/gallery`)
    .set('Authorization', `Bearer ${token}`)
    
  return response.body.images as GalleryImage[]
}

export async function uploadImage(
  file: File,
  userId: string,
  getAccessTokenSilently: (options?: object) => Promise<string>,
  caption?: string,
): Promise<GalleryImage> {
  const token = await getAccessTokenSilently({
    authorizationParams: {
      audience: 'https://api.momodex.com',
    },
  })

  const response = await request
    .post(`${rootURL}/gallery`)
    .set('Authorization', `Bearer ${token}`)
    .field('user_id', userId)
    .field('caption', caption ?? '')
    .attach('image', file)

  return response.body
}
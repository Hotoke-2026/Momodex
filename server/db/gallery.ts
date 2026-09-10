import connection from './connection.ts'
import { GalleryImage, CreateGalleryImageDTO } from '../../models/types.ts'

export async function getAllGalleryImages(
  db = connection,
): Promise<GalleryImage[]> {
  return db('gallery').select()
}

export async function createGalleryImage(
  data: CreateGalleryImageDTO,
  db = connection,
): Promise<GalleryImage> {
  const [row] = await db('gallery').insert(data).returning('*')
  return row
}

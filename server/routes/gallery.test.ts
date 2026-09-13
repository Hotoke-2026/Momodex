import 'dotenv/config'
import { beforeAll, afterAll, it, expect, vi } from 'vitest'
import request from 'supertest'
import server from '../server.ts'
import connection from '../db/connection.ts'

vi.mock('../middleware/authMiddleware.ts', () => ({
  checkJwt: (req: any, res: any, next: any) => {
    req.auth = { payload: { sub: 'user1' } }
    next()
  },
}))

vi.mock('cloudinary', () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload_stream: (callback: any) => {
        const stream: any = {
          end: (buffer: Buffer) => {
            callback(null, { secure_url: 'https://res.cloudinary.com/test/image/upload/v12345/test.jpg' })
          },
        }
        return stream
      },
    },
  },
}))

beforeAll(async () => {
  await connection.migrate.latest()
  await connection.seed.run()

  await connection('users')
    .insert({
      id: 'user1',
      name: 'Test User',
    })
    .onConflict('id')
    .ignore()
})

afterAll(async () => connection.destroy())

it('POST /api/v1/gallery uploads a valid image', async () => {
  const res = await request(server)
    .post('/api/v1/gallery')
    .set('Authorization', 'Bearer mock-token')
    .field('caption', 'test upload')
    .attach('image', Buffer.from('fake-image-bytes'), 'test-image.jpg')

  expect(res.status).toBe(201)
  expect(res.body.image_url).toContain('cloudinary.com')
})

it('rejects non-image file types', async () => {
  const res = await request(server)
    .post('/api/v1/gallery')
    .set('Authorization', 'Bearer mock-token')
    .attach('image', Buffer.from('not an image'), 'file.txt')

  expect(res.status).toBe(400)
})

it('rejects files over 5MB', async () => {
  const bigBuffer = Buffer.alloc(6 * 1024 * 1024)
  const res = await request(server)
    .post('/api/v1/gallery')
    .set('Authorization', 'Bearer mock-token')
    .attach('image', bigBuffer, 'big.jpg')

  expect(res.status).toBe(400)
})
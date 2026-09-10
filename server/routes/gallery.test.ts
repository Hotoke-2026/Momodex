import 'dotenv/config'
import { beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import server from '../server.ts'
import connection from '../db/connection.ts'

beforeAll(async () => {
  await connection.migrate.latest()
  await connection.seed.run()
})

afterAll(async () => connection.destroy())

it('POST /api/v1/gallery uploads a valid image', async () => {
  const res = await request(server)
    .post('/api/v1/gallery')
    .field('user_id', 'user1')
    .field('caption', 'test upload')
    .attach('image', 'gemini-test/test-image.jpg')

  expect(res.status).toBe(201)
  expect(res.body.image_url).toContain('cloudinary.com')
})

it('rejects non-image file types', async () => {
  const res = await request(server)
    .post('/api/v1/gallery')
    .field('user_id', 'user1')
    .attach('image', Buffer.from('not an image'), 'file.txt')

  expect(res.status).toBe(400)
})

it('rejects files over 5MB', async () => {
  const bigBuffer = Buffer.alloc(6 * 1024 * 1024)
  const res = await request(server)
    .post('/api/v1/gallery')
    .field('user_id', 'user1')
    .attach('image', bigBuffer, 'big.jpg')

  expect(res.status).toBe(400)
})

import { beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import server from '../server.ts'
import connection from '../db/connection.ts'

beforeAll(async () => {
  await connection.migrate.latest()
  await connection.seed.run()
})

afterAll(async () => connection.destroy())

it('GET /api/v1/fruits returns seeded fruit', async () => {
  const res = await request(server).get('/api/v1/fruits')

  expect(res.status).toBe(200)
  expect(res.body.fruits).toContain('banana')
})

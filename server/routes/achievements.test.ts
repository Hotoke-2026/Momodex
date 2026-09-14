import { beforeAll, beforeEach, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import server from '../server.ts'
import connection from '../db/connection.ts'

const userId = 'test-user'

beforeAll(async () => {
  await connection.migrate.latest()
  await connection.seed.run()
})

beforeEach(async () => {
  await connection('achievements').where({ user_id: userId }).del()
  await connection('cards').where({ user_id: userId }).del()
  await connection('users').where({ id: userId }).del()
  await connection('users').insert({ id: userId, name: 'Test User' })
})

afterAll(async () => connection.destroy())

it('GET /api/v1/achievements returns all achievements as locked for a new user', async () => {
  const res = await request(server).get('/api/v1/achievements').query({ userId })

  expect(res.status).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
  expect(res.body.every((achievement: { unlocked: boolean }) => achievement.unlocked === false)).toBe(
    true,
  )
})

it('unlocks and persists "First Find" once a user has collected at least one species', async () => {
  const allSpecies = await connection('species').select('id')

  await connection('cards').insert(
    allSpecies.map((species, index) => ({
      card_name: `Card ${index}`,
      user_id: userId,
      species_id: species.id,
      image_url: 'http://example.com/img.png',
    })),
  )

  const checkRes = await request(server).post('/api/v1/achievements/check').send({ userId })
  expect(checkRes.status).toBe(200)
  expect(checkRes.body.some((a: { type: string }) => a.type === 'first_find')).toBe(true)

  const stored = await connection('achievements')
    .where({ user_id: userId, type: 'first_find' })
    .first()
  expect(stored).toBeDefined()

  const getRes = await request(server).get('/api/v1/achievements').query({ userId })
  const firstFind = getRes.body.find((a: { type: string }) => a.type === 'first_find')
  expect(firstFind.unlocked).toBe(true)
})

it('does not duplicate an achievement if checked again after already unlocked', async () => {
  const allSpecies = await connection('species').select('id')

  await connection('cards').insert(
    allSpecies.map((species, index) => ({
      card_name: `Card ${index}`,
      user_id: userId,
      species_id: species.id,
      image_url: 'http://example.com/img.png',
    })),
  )

  await request(server).post('/api/v1/achievements/check').send({ userId })
  await request(server).post('/api/v1/achievements/check').send({ userId })

  const rows = await connection('achievements').where({ user_id: userId, type: 'first_find' })
  expect(rows.length).toBe(1)
})
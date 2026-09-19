import { beforeAll, beforeEach, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import server from '../server.ts'
import db from '../db/connection.ts'

const userId = 'test-user'

beforeAll(async () => {
  // If you have migration/seed files, run them via libSQL statements 
  // or setup your test database schema beforehand.
})

beforeEach(async () => {
  await db.execute({ sql: 'DELETE FROM achievements WHERE user_id = ?', args: [userId] })
  await db.execute({ sql: 'DELETE FROM cards WHERE user_id = ?', args: [userId] })
  await db.execute({ sql: 'DELETE FROM users WHERE id = ?', args: [userId] })
  await db.execute({
    sql: 'INSERT INTO users (id, name) VALUES (?, ?)',
    args: [userId, 'Test User'],
  })
})

afterAll(async () => {
  // libSQL client doesn't need explicit destroy like knex, but close if supported
  await db.close?.()
})

it('GET /api/v1/achievements returns all achievements as locked for a new user', async () => {
  const res = await request(server).get('/api/v1/achievements').query({ userId })

  expect(res.status).toBe(200)
  expect(res.body.length).toBeGreaterThan(0)
  expect(res.body.every((achievement: { unlocked: boolean }) => achievement.unlocked === false)).toBe(
    true,
  )
})

it('unlocks and persists "First Find" once a user has collected at least one species', async () => {
  const speciesResult = await db.execute('SELECT id FROM species')
  const allSpecies = speciesResult.rows

  for (const [index, species] of allSpecies.entries()) {
    await db.execute({
      sql: 'INSERT INTO cards (card_name, user_id, species_id, image_url) VALUES (?, ?, ?, ?)',
      args: [`Card ${index}`, userId, species.id as string, 'http://example.com/img.png'],
    })
  }

  const checkRes = await request(server).post('/api/v1/achievements/check').send({ userId })
  expect(checkRes.status).toBe(200)
  expect(checkRes.body.some((a: { type: string }) => a.type === 'first_find')).toBe(true)

  const storedResult = await db.execute({
    sql: 'SELECT * FROM achievements WHERE user_id = ? AND type = ?',
    args: [userId, 'first_find'],
  })
  expect(storedResult.rows[0]).toBeDefined()

  const getRes = await request(server).get('/api/v1/achievements').query({ userId })
  const firstFind = getRes.body.find((a: { type: string }) => a.type === 'first_find')
  expect(firstFind.unlocked).toBe(true)
})

it('does not duplicate an achievement if checked again after already unlocked', async () => {
  const speciesResult = await db.execute('SELECT id FROM species')
  const allSpecies = speciesResult.rows

  for (const [index, species] of allSpecies.entries()) {
    await db.execute({
      sql: 'INSERT INTO cards (card_name, user_id, species_id, image_url) VALUES (?, ?, ?, ?)',
      args: [`Card ${index}`, userId, species.id as string, 'http://example.com/img.png'],
    })
  }

  await request(server).post('/api/v1/achievements/check').send({ userId })
  await request(server).post('/api/v1/achievements/check').send({ userId })

  const rowsResult = await db.execute({
    sql: 'SELECT * FROM achievements WHERE user_id = ? AND type = ?',
    args: [userId, 'first_find'],
  })
  expect(rowsResult.rows.length).toBe(1)
})

it('unlocks battle achievements when a battle result is provided', async () => {
  const res = await request(server).post('/api/v1/achievements/check').send({
    userId,
    winner: 'player',
    opponentWasInvasive: true,
  })

  expect(res.status).toBe(200)
  expect(res.body.some((a: { type: string }) => a.type === 'first_win')).toBe(true)
  expect(
    res.body.some((a: { type: string }) => a.type === 'first_invasive_defeated'),
  ).toBe(true)

  const getRes = await request(server).get('/api/v1/achievements').query({ userId })
  expect(getRes.body.find((a: { type: string }) => a.type === 'first_win').unlocked).toBe(true)
  expect(
    getRes.body.find((a: { type: string }) => a.type === 'first_invasive_defeated').unlocked,
  ).toBe(true)
})
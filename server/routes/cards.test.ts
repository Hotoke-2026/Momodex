import { describe, it, expect, beforeEach, vi } from 'vitest'
import request from 'supertest'
import server from '../server'
import db from '../db/connection'

vi.mock('../middleware/authMiddleware', () => ({
  checkJwt: (req: any, res: any, next: any) => {
    req.auth = { payload: { sub: 'auth0|test-user-id' } }
    next()
  },
}))

describe('POST /api/v1/cards', () => {
  beforeEach(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
    await db.seed.run()

    await db('users')
      .insert({
        id: 'auth0|test-user-id',
        name: 'Test User',
      })
      .onConflict('id')
      .ignore()
  })

  it('saves a card to SQLite', async () => {
    const payload = {
      card_name: 'Test Card',
      species_id: 'tui',
      image_url: 'http://example.com/img.png',
    }

    const res = await request(server)
      .post('/api/v1/cards')
      .set('Authorization', 'Bearer mock-token')
      .send(payload)

    expect(res.status).toBe(201)
    expect(res.body.card_name).toBe('Test Card')

    const dbRecord = await db('cards')
      .where({ card_name: 'Test Card' })
      .first()
    expect(dbRecord).toBeDefined()
  })
})
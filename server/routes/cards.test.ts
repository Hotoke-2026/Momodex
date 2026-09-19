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
    await db.execute('DROP TABLE IF EXISTS cards;')
    await db.execute('DROP TABLE IF EXISTS users;')

    await db.execute(`
      CREATE TABLE users (
        id TEXT PRIMARY KEY,
        name TEXT
      );
    `)

    await db.execute(`
      CREATE TABLE cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        card_name TEXT,
        species_id TEXT,
        image_url TEXT,
        location TEXT,
        user_id TEXT
      );
    `)

    await db.execute({
      sql: 'INSERT INTO users (id, name) VALUES (?, ?)',
      args: ['auth0|test-user-id', 'Test User']
    })
  })

  it('saves a card to Turso/libSQL', async () => {
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

    const dbResult = await db.execute({
      sql: 'SELECT * FROM cards WHERE card_name = ?',
      args: ['Test Card']
    })
    
    expect(dbResult.rows.length).toBeGreaterThan(0)
    expect(dbResult.rows[0].card_name).toBe('Test Card')
  })
})
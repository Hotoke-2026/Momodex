import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import server from '../server'
import db from '../db/connection'

describe('POST /api/cards', () => {
  beforeEach(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
    await db.seed.run()
  })

  it('saves a card to SQLite', async () => {
    const payload = { card_name: 'Test Card', species_id: 'tui', image_url: 'http://example.com/img.png' }

    const res = await request(server).post('/api/cards').send(payload)

    expect(res.status).toBe(201)
    expect(res.body.card_name).toBe('Test Card')

    const dbRecord = await db('cards').where({ card_name: 'Test Card' }).first()
    expect(dbRecord).toBeDefined()
  })
})
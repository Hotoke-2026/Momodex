import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import server from '../server'

vi.mock('../middleware/authMiddleware', () => ({
  checkJwt: (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    req.auth = { payload: { sub: 'auth0|test-user-id' } }
    next()
  },
}))

describe('Protected Routes Authentication', () => {
  it('returns 401 Unauthorized when accessing /api/v1/cards/test-user-id without a token', async () => {
    const response = await request(server).get('/api/v1/cards/test-user-id')
    expect(response.status).toBe(401)
  })

  it('returns 401 Unauthorized when accessing /api/v1/users/test-user-id without a token', async () => {
    const response = await request(server).get('/api/v1/users/test-user-id')
    expect(response.status).toBe(401)
  })
})
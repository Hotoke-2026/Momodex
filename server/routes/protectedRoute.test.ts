import { describe, it, expect } from 'vitest'
import request from 'supertest'
import express from 'express'
import { checkJwt } from '../middleware/authMiddleware'

const app = express()
app.use(express.json())
app.get('/api/v1/protected', checkJwt, (req, res) => {
  res.json({ message: 'Access granted' })
})

describe('GET /api/v1/protected', () => {
  it('should return 401 Unauthorized when no token is provided', async () => {
    const response = await request(app).get('/api/v1/protected')
    expect(response.status).toBe(401)
  })
})
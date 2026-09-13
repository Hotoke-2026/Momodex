import { Router, Response } from 'express'
import db from '../db/connection'
import { checkJwt } from '../middleware/authMiddleware'

const router = Router()

router.get('/:id', checkJwt, async (req, res) => {
  try {
    const authenticatedUserId = req.auth?.payload?.sub
    const requestedId = req.params.id

    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (authenticatedUserId !== requestedId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own profile' })
    }

    const user = await db('users').where({ id: requestedId }).first()
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

export default router
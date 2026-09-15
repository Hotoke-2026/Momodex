import express from 'express'
import { getCardsByUserId } from '../services/cardsService'
import { insertCard } from '../db/cards'
import { checkJwt } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/:userId', checkJwt, async (req, res) => {
  try {
    const authenticatedUserId = req.auth?.payload?.sub
    const requestedId = req.params.userId

    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (authenticatedUserId !== requestedId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own cards' })
    }

    const cards = await getCardsByUserId(requestedId)
    res.json(cards)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cards' })
  }
})

router.post('/', checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const newCard = await insertCard(req.body, userId)
    res.status(201).json(newCard)
  } catch (error) {
    console.error('SERVER ERROR:', error)
    res.status(500).json({ message: 'Failed to save card' })
  }
})

export default router
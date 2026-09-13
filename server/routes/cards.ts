import express, { Response } from 'express'
import { getCardsByUserId } from '../services/cardsService'
import { insertCard } from '../db/cards'
import { checkJwt } from '../middleware/authMiddleware'

const router = express.Router()

router.get('/', checkJwt, async (req, res) => {
  try {
    const userId = req.auth?.payload?.sub

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const cards = await getCardsByUserId(userId)
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
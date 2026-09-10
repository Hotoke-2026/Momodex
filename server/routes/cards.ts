import express, { Response } from 'express'
import { getCardsByUserId } from '../services/cardsService'
import { insertCard } from '../db/cards'
import { AuthenticatedRequest } from '../src/express'

const router = express.Router()

router.get('/', async (req, res) => {
  const userId = req.query.userId as string

  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' })
  }

  const cards = await getCardsByUserId(userId)
  res.json(cards)
})

router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.auth?.userId || 'guest'
    const newCard = await insertCard(req.body, userId)
    res.status(201).json(newCard)
  } catch (error) {
    res.status(500).json({ message: 'Failed to save card' })
  }
})

export default router

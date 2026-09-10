// server/routes/cards.ts
import { Router } from 'express'
import { getCardsByUserId } from '../services/cardsService'

const router = Router()

router.get('/', async (req, res) => {
  const userId = req.query.userId as string

  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' })
  }

  const cards = await getCardsByUserId(userId)
  res.json(cards)
})

export default router

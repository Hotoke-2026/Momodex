import express from 'express'
import { insertCard, getUserCards } from '../db/cards'
import { checkJwt } from '../middleware/authMiddleware'
import { AuthenticatedRequest } from '../src/express'

const router = express.Router()

// GET /api/v1/cards - Fetch cards for the authenticated user only
router.get('/', checkJwt, async (req, res): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).auth?.payload.sub as string

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: Missing user ID' })
      return
    }

    const cards = await getUserCards(userId)
    res.json(cards)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cards' })
  }
})

// POST /api/v1/cards - Save a card tied to the authenticated user
router.post('/', checkJwt, async (req, res): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).auth?.payload.sub

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized: Missing user ID' })
      return
    }

    const newCard = await insertCard(req.body, userId)
    res.status(201).json(newCard)
  } catch (error) {
    res.status(500).json({ message: 'Failed to save card' })
  }
})

export default router
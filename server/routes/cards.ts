import express, { Response } from 'express'
import { insertCard } from '../db/cards'
import { AuthenticatedRequest } from '../src/express'

const router = express.Router()

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
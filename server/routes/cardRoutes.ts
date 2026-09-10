import express, { Request, Response } from 'express'
import { handleSaveCard } from '../../client/hooks/cardController'

const router = express.Router()

// POST /api/cards
router.post('/', handleSaveCard)

export default router
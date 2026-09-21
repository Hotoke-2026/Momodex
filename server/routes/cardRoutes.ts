import express from 'express'
import { handleSaveCard } from '../../client/hooks/cardController'
import { checkJwt } from '../middleware/authMiddleware'

const router = express.Router()

// POST /api/cards
router.post('/', checkJwt, handleSaveCard)

export default router

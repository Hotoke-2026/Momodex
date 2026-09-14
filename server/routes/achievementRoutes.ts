import express from 'express'
import { getAchievementsForUser, checkAchievements } from '../services/achievementsService'

const router = express.Router()

router.get('/', async (req, res) => {
  const userId = req.query.userId as string

  if (!userId) {
    return res.status(400).json({ error: 'userId query parameter is required' })
  }

  const achievements = await getAchievementsForUser(userId)
  res.json(achievements)
})

// Re-evaluates a user's achievements against their current card collection.
// Call this after a card is successfully saved (see useCreateCard).
router.post('/check', async (req, res) => {
  const userId = req.body.userId as string
  const winner = req.body.winner as 'player' | 'ai' | undefined
  const opponentWasInvasive = Boolean(req.body.opponentWasInvasive)

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' })
  }

  try {
    const newlyUnlocked = await checkAchievements(userId, {
      winner,
      opponentWasInvasive,
    })
    res.status(200).json(newlyUnlocked)
  } catch (error) {
    res.status(500).json({ message: 'Failed to check achievements' })
  }
})

export default router
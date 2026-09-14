// server/routes/users.ts
import { Router } from 'express'
import db from '../db/connection'
import { getOrCreateBattleStats } from '../db/battleStats'
import { getFavouriteSpeciesForUser } from '../db/favouriteSpecies'

const router = Router()

router.get('/:id', async (req, res) => {
  const user = await db('users').where({ id: req.params.id }).first()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json(user)
})
router.get('/:id/battle-stats', async (req, res) => {
  const stats = await getOrCreateBattleStats(req.params.id)
  res.json(stats)
})

router.get('/:id/favourite-species', async (req, res) => {
  const favourite = await getFavouriteSpeciesForUser(req.params.id)
  res.json(favourite)
})
export default router

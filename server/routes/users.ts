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

router.patch('/:id/favourite-species', async (req, res) => {
  const name = req.body.name as string
  if (!name) {
    return res.status(400).json({ error: 'name is required' })
  }

  await db('users').where({ id: req.params.id }).update({ favourite_species: name })
  const user = await db('users').where({ id: req.params.id }).first()
  res.json(user)
})
export default router

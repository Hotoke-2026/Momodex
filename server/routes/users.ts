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

router.get('/:id/last-capture', async (req, res) => {
  const card = await db('cards')
    .where({ user_id: req.params.id })
    .orderBy('created_at', 'desc')
    .select('created_at', 'location')
    .first()
  res.json(card ?? null)
})

router.patch('/:id', async (req, res) => {
  const { favourite_species, currently_seeking } = req.body
  const updates = {}
  if (favourite_species !== undefined) updates.favourite_species = favourite_species
  if (currently_seeking !== undefined) updates.currently_seeking = currently_seeking
  if (Object.keys(updates).length > 0) {
    await db('users').where({ id: req.params.id }).update(updates)
  }
  const user = await db('users').where({ id: req.params.id }).first()
  res.json(user)
})

export default router

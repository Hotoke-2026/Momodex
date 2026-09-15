import { Router, Response } from 'express'
import db from '../db/connection'
import { getOrCreateBattleStats } from '../db/battleStats'
import { checkJwt } from '../middleware/authMiddleware'

const router = Router()

router.get('/:id', checkJwt, async (req, res) => {
  try {
    const authenticatedUserId = req.auth?.payload?.sub
    const requestedId = req.params.id

    if (!authenticatedUserId) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (authenticatedUserId !== requestedId) {
      return res.status(403).json({ error: 'Forbidden: You can only view your own profile' })
    }

    const user = await db('users').where({ id: requestedId }).first()
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.get('/:id/battle-stats', async (req, res) => {
  const stats = await getOrCreateBattleStats(req.params.id)
  res.json(stats)
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
  const { favourite_species, currently_seeking } = req.body as {
    favourite_species?: string
    currently_seeking?: string
  }

  const updates: Record<string, string> = {}
  if (favourite_species !== undefined) updates.favourite_species = favourite_species
  if (currently_seeking !== undefined) updates.currently_seeking = currently_seeking

  if (Object.keys(updates).length > 0) {
    await db('users').where({ id: req.params.id }).update(updates)
  }

  const user = await db('users').where({ id: req.params.id }).first()
  res.json(user)
})

router.get('/:id/battle-stats', async (req, res) => {
  const stats = await getOrCreateBattleStats(req.params.id)
  res.json(stats)
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
  const { favourite_species, currently_seeking } = req.body as {
    favourite_species?: string
    currently_seeking?: string
  }

  const updates: Record<string, string> = {}
  if (favourite_species !== undefined) updates.favourite_species = favourite_species
  if (currently_seeking !== undefined) updates.currently_seeking = currently_seeking

  if (Object.keys(updates).length > 0) {
    await db('users').where({ id: req.params.id }).update(updates)
  }

  const user = await db('users').where({ id: req.params.id }).first()
  res.json(user)
})

export default router
import { Router } from 'express'
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

    const { name, picture } = req.query as { name?: string; picture?: string }

    let userResult = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [requestedId],
    })
    let user = userResult.rows[0]

    if (!user) {
      await db.execute({
        sql: 'INSERT INTO users (id, name, avatar_url) VALUES (?, ?, ?)',
        args: [requestedId, name || requestedId, picture ?? null],
      })
      userResult = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [requestedId],
      })
      user = userResult.rows[0]
    } else if (user.name === requestedId && name) {
      // backfill accounts created before we had access to the real Auth0 profile
      await db.execute({
        sql: 'UPDATE users SET name = ?, avatar_url = COALESCE(avatar_url, ?) WHERE id = ?',
        args: [name, picture ?? null, requestedId],
      })
      userResult = await db.execute({
        sql: 'SELECT * FROM users WHERE id = ?',
        args: [requestedId],
      })
      user = userResult.rows[0]
    }

    res.json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    res.status(500).json({ error: 'Failed to fetch user' })
  }
})

router.get('/:id/battle-stats', checkJwt, async (req, res) => {
  const stats = await getOrCreateBattleStats(req.params.id)
  res.json(stats)
})

router.get('/:id/last-capture', checkJwt, async (req, res) => {
  const cardResult = await db.execute({
    sql: 'SELECT created_at, location FROM cards WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
    args: [req.params.id],
  })
  res.json(cardResult.rows[0] ?? null)
})

router.patch('/:id', checkJwt, async (req, res) => {
  const { favourite_species, currently_seeking } = req.body as {
    favourite_species?: string
    currently_seeking?: string
  }

  const updates: string[] = []
  const args: any[] = []

  if (favourite_species !== undefined) {
    updates.push('favourite_species = ?')
    args.push(favourite_species)
  }
  if (currently_seeking !== undefined) {
    updates.push('currently_seeking = ?')
    args.push(currently_seeking)
  }

  if (updates.length > 0) {
    args.push(req.params.id)
    await db.execute({
      sql: `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      args,
    })
  }

  const userResult = await db.execute({
    sql: 'SELECT * FROM users WHERE id = ?',
    args: [req.params.id],
  })
  res.json(userResult.rows[0])
})

export default router
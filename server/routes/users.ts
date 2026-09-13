// server/routes/users.ts
import { Router } from 'express'
import db from '../db/connection'

const router = Router()

router.get('/:id', async (req, res) => {
  const user = await db('users').where({ id: req.params.id }).first()
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }
  res.json(user)
})

export default router

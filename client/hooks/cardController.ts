import { Request, Response } from 'express'
import db from '../../server/db/connection'

export async function handleSaveCard(req: Request, res: Response) {
  try {
    const authReq = req as Request & {
      auth?: { payload?: { sub?: string }, userId?: string }
    }
    const userId = authReq.auth?.payload?.sub || authReq.auth?.userId || req.body.userId || 'guest'

    const { card_name, image_url, species_id, location } = req.body

    const result = await (db as any).execute({
      sql: `INSERT INTO cards (card_name, image_url, species_id, location, user_id) 
            VALUES (?, ?, ?, ?, ?) 
            RETURNING *`,
      args: [card_name, image_url, species_id, location, userId]
    })

    const createdCard = result.rows[0]

    res.status(201).json(createdCard)
  } catch (error) {
    console.error('Error saving card:', error)
    res.status(500).json({ error: 'Failed to save card to database' })
  }
}
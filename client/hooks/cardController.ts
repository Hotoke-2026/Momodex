import { Request, Response } from 'express'
import db from '../../server/db/connection'

export async function handleSaveCard(req: Request, res: Response) {
  try {
    // Extract Auth0 sub ID from req.auth (or fallback body/guest)
    const authReq = req as Request & {
      auth?: { payload?: { sub?: string }, userId?: string }
    }
    const userId = authReq.auth?.payload?.sub || authReq.auth?.userId || req.body.userId || 'guest'

    // Extract card parameters from request body
    const { card_name, image_url, species_id, location } = req.body

    const [createdCard] = await db('cards')
      .insert({
        card_name: card_name,
        image_url: image_url,
        species_id: species_id,
        location: location,
        user_id: userId,
      })
      .returning('*')

    res.status(201).json(createdCard)
  } catch (error) {
    console.error('Error saving card:', error)
    res.status(500).json({ error: 'Failed to save card to database' })
  }
}
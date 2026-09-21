// server/services/cardsService.ts
import db from '../db/connection'

export async function insertCard(cardData: {
  card_name: string
  user_id: string
  species_id: number
  image_url: string
  location?: string | null
}) {
  const result = await db.execute({
    sql: `
      INSERT INTO cards (user_id, species_id, image_url, location) 
      VALUES (?, ?, ?, ?)
    `,
    args: [
      cardData.user_id,
      cardData.species_id,
      cardData.image_url,
      cardData.location ?? null,
    ],
  })

  const newCardId = result.lastInsertRowid !== undefined ? Number(result.lastInsertRowid) : 0

  const fetchResult = await db.execute({
    sql: `SELECT * FROM cards WHERE id = ?`,
    args: [newCardId],
  })

  return fetchResult.rows[0]
}

export async function getCardsByUserId(userId: string) {
  const result = await db.execute({
    sql: `SELECT 
            cards.id as card_id,
            cards.user_id,
            cards.species_id,
            cards.image_url,
            cards.location,
            cards.created_at,
            species.name,
            species.type,
            species.hp,
            species.attack,
            species.attack_name,
            species.attack_two,
            species.attack_two_name,
            species.effect_type,
            species.effect_value,
            species.effect_trigger,
            species.rarity,
            species.status,
            species.description,
            species.fun_fact
          FROM cards
          JOIN species ON cards.species_id = species.id
          WHERE cards.user_id = ?`,
    args: [userId],
  })

  const rows = result.rows

  // The join gives us one FLAT row per card, mixing card + species columns
  // together. We reshape it here into the { card, species } pairs your
  // React components actually expect — better to do this awkward mapping
  // once on the backend than repeat it in every frontend component.

  return rows.map((row) => ({
    card: {
      id: row.card_id,
      user_id: row.user_id,
      species_id: row.species_id,
      image_url: row.image_url,
      location: row.location,
      created_at: row.created_at,
    },
    species: {
      id: row.species_id,
      name: row.name,
      type: row.type,
      hp: row.hp,
      attack: row.attack,
      attack_name: row.attack_name,
      attack_two: row.attack_two,
      attack_two_name: row.attack_two_name,
      effect_type: row.effect_type,
      effect_value: row.effect_value,
      effect_trigger: row.effect_trigger,
      rarity: row.rarity,
      status: row.status,
      description: row.description,
      fun_fact: row.fun_fact,
    },
  }))
}

export async function deleteCard(cardId: number, userId: string) {
  const result = await db.execute({
    sql: 'DELETE FROM cards WHERE id = ? AND user_id = ?',
    args: [cardId, userId],
  })
  // rowsAffected tells us how many rows were deleted
  return (result.rowsAffected ?? 0) > 0
}
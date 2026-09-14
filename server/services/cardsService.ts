// server/services/cardsService.ts
import db from '../db/connection'
import { NewCard } from '../../models/types'

export async function insertCard(newCard: NewCard) {
  const [card] = await db('cards').insert(newCard).returning('*')
  return card
}

export async function getCardsByUserId(userId: string) {
  const rows = await db('cards')
    .join('species', 'cards.species_id', 'species.id')
    .where('cards.user_id', userId)
    .select(
      'cards.id as card_id',
      'cards.user_id',
      'cards.species_id',
      'cards.image_url',
      'cards.location',
      'cards.created_at',
      'species.name',
      'species.type',
      'species.hp',
      'species.attack',
      'species.rarity',
      'species.status',
      'species.description',
    )

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
      rarity: row.rarity,
      status: row.status,
      description: row.description,
    },
  }))
}

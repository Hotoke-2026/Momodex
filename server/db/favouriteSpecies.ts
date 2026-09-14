import db from './connection'
import type { FavouriteSpecies } from '../../models/types'

export async function getFavouriteSpeciesForUser(userId: string): Promise<FavouriteSpecies | null> {
  const user = await db('users').where({ id: userId }).first()
  if (!user?.favourite_species_id) return null

  const species = await db('species').where({ id: user.favourite_species_id }).first()
  const card = (await db('cards')
    .where({ user_id: userId, species_id: user.favourite_species_id })
    .orderBy('created_at', 'desc')
    .first()) ?? null

  return { species, card }
}

export async function setFavouriteSpeciesForUser(userId: string, speciesId: string) {
  await db('users').where({ id: userId }).update({ favourite_species_id: speciesId })
  return getFavouriteSpeciesForUser(userId)
}
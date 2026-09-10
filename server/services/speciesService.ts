import db from '../db/connection'

export async function getSpeciesShortlist() {
  return db('species').select('id', 'name') // just for Gemini to provide list of species to choose from when creating a card
}

export async function getSpeciesById(id: string) {
  return db('species').where({ id }).first() // .first() returns one row, not an array
}

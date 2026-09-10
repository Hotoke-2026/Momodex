import db from '../db/connection'

export async function getSpeciesShortlist() {
  return db('species').select('id', 'name')
}

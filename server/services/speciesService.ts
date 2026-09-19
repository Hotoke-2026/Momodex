import db from '../db/connection'

export interface Species {
  id: string
  name: string
}

export async function getSpeciesShortlist(): Promise<Species[]> {
  const result = await db.execute('SELECT id, name FROM species')
  return result.rows as unknown as Species[]
}

export async function getSpeciesById(id: string): Promise<Species | undefined> {
  const result = await db.execute({
    sql: 'SELECT * FROM species WHERE id = ?',
    args: [id]
  })
  return result.rows[0] as unknown as Species | undefined
}
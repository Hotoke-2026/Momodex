import db from '../connection.js'

export async function up() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS species (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      hp INTEGER NOT NULL,
      attack INTEGER NOT NULL,
      rarity TEXT NOT NULL,
      status TEXT NOT NULL,
      description TEXT NOT NULL
    )
  `)
}

export async function down() {
  await db.execute(`DROP TABLE IF EXISTS species`)
}
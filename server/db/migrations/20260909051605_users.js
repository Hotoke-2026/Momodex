import db from '../connection.js'

export async function up() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )
  `)
}

export async function down() {
  await db.execute(`DROP TABLE IF EXISTS users`)
}
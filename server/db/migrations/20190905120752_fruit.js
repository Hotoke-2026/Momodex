import db from '../connection.js'

export async function up() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS fruit (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )
  `)
}

export async function down() {
  await db.execute(`DROP TABLE IF EXISTS fruit`)
}
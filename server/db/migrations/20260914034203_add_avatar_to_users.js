import db from '../connection.js'

export async function up() {
  await db.execute(`
    ALTER TABLE users ADD COLUMN avatar_url TEXT
  `)
}

export async function down() {
  await db.execute(`
    ALTER TABLE users DROP COLUMN avatar_url
  `)
}
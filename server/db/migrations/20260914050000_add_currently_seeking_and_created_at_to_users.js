import db from '../connection.js'

export async function up() {
  await db.execute(`
    ALTER TABLE users ADD COLUMN currently_seeking TEXT;
  `)
  await db.execute(`
    ALTER TABLE users ADD COLUMN created_at DATETIME;
  `)
}

export async function down() {
  await db.execute(`
    ALTER TABLE users DROP COLUMN currently_seeking;
  `)
  await db.execute(`
    ALTER TABLE users DROP COLUMN created_at;
  `)
}
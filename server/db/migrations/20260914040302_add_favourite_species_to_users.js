import db from '../connection.js'

export async function up() {
  await db.execute(`
    ALTER TABLE users ADD COLUMN favourite_species TEXT
  `)
}

export async function down() {
  await db.execute(`
    ALTER TABLE users DROP COLUMN favourite_species
  `)
}
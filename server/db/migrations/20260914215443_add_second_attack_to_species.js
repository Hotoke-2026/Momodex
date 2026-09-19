import db from '../connection.js'

export async function up() {
  await db.execute(`ALTER TABLE species ADD COLUMN attack_name TEXT`)
  await db.execute(`ALTER TABLE species ADD COLUMN attack_two_name TEXT`)
  await db.execute(`ALTER TABLE species ADD COLUMN attack_two INTEGER`)
}

export async function down() {
  await db.execute(`ALTER TABLE species DROP COLUMN attack_name`)
  await db.execute(`ALTER TABLE species DROP COLUMN attack_two_name`)
  await db.execute(`ALTER TABLE species DROP COLUMN attack_two`)
}
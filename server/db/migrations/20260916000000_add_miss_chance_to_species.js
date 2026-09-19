import db from '../connection.js'

export async function up() {
  await db.execute(`ALTER TABLE species ADD COLUMN attack_miss_chance INTEGER NOT NULL DEFAULT 5`)
  await db.execute(`ALTER TABLE species ADD COLUMN attack_two_miss_chance INTEGER`)
}

export async function down() {
  await db.execute(`ALTER TABLE species DROP COLUMN attack_miss_chance`)
  await db.execute(`ALTER TABLE species DROP COLUMN attack_two_miss_chance`)
}
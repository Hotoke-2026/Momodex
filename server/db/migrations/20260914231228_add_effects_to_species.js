import db from '../connection.js'

export async function up() {
  await db.execute(`ALTER TABLE species ADD COLUMN effect_type TEXT`)
  await db.execute(`ALTER TABLE species ADD COLUMN effect_value INTEGER`)
  await db.execute(`ALTER TABLE species ADD COLUMN effect_trigger TEXT`)
}

export async function down() {
  await db.execute(`ALTER TABLE species DROP COLUMN effect_type`)
  await db.execute(`ALTER TABLE species DROP COLUMN effect_value`)
  await db.execute(`ALTER TABLE species DROP COLUMN effect_trigger`)
}
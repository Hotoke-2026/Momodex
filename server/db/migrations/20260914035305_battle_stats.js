import db from '../connection.js'

export async function up() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS battle_stats (
      user_id TEXT PRIMARY KEY,
      wins INTEGER NOT NULL DEFAULT 0,
      losses INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `)
}

export async function down() {
  await db.execute(`DROP TABLE IF EXISTS battle_stats`)
}
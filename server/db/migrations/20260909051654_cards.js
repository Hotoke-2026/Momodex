import db from '../connection.js'

export async function up() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS cards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      card_name TEXT NOT NULL,
      user_id TEXT NOT NULL,
      species_id TEXT NOT NULL,
      image_url TEXT NOT NULL,
      location TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (species_id) REFERENCES species(id)
    )
  `)
}

export async function down() {
  await db.execute(`DROP TABLE IF EXISTS cards`)
}
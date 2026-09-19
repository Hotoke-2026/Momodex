import db from '../connection.js'

export async function seed() {
  // Delete records in reverse order of foreign key dependencies
  await db.execute('DELETE FROM achievements')
  await db.execute('DELETE FROM battle_stats')
  await db.execute('DELETE FROM cards')
  await db.execute('DELETE FROM users')

  // Insert initial users
  await db.execute({
    sql: `
      INSERT INTO users (id, name) VALUES 
      ('user1', 'David'),
      ('guest', 'Guest')
    `,
  })
}
import db from '../connection.js'

export async function up() {
  // Get all users where created_at is NULL
  const result = await db.execute(`
    SELECT id FROM users WHERE created_at IS NULL
  `)
  const usersMissingDate = result.rows

  for (const row of usersMissingDate) {
    const id = row.id

    // Find the user's earliest card
    const cardResult = await db.execute({
      sql: `
        SELECT created_at FROM cards 
        WHERE user_id = ? 
        ORDER BY created_at ASC 
        LIMIT 1
      `,
      args: [id]
    })

    const earliestCard = cardResult.rows[0]
    const createdAtValue = earliestCard?.created_at ?? new Date().toISOString()

    // Update the user's created_at timestamp
    await db.execute({
      sql: `
        UPDATE users 
        SET created_at = ? 
        WHERE id = ?
      `,
      args: [createdAtValue, id]
    })
  }
}

export async function down() {
  // no-op
}
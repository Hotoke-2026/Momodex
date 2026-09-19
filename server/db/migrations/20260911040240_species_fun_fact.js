import db from '../connection.js'

export async function up() {
  await db.execute(`
    ALTER TABLE species ADD COLUMN fun_fact TEXT
  `)
}

export async function down() {

  await db.execute(`
    ALTER TABLE species DROP COLUMN fun_fact
  `)
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 * Kept as its own table (rather than columns on `users`) so more stats
 * (win streak, favourite move, etc.) can be added later without altering
 * the users table again.
 **/

export async function up(knex) {
  await knex.schema.createTable('battle_stats', (table) => {
    table.string('user_id').primary()
    table.integer('wins').notNullable().defaultTo(0)
    table.integer('losses').notNullable().defaultTo(0)

    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('battle_stats')
}
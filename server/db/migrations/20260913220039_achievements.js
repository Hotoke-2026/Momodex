/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.createTable('achievements', (table) => {
    table.string('id').primary()
    table.string('user_id').notNullable()
    table.string('type').notNullable() // e.g. "full_deck"
    table.string('name').notNullable() // e.g. "Full Deck"
    table.timestamp('unlocked_at').defaultTo(knex.fn.now())

    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('achievements')
}
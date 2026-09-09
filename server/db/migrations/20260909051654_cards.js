/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.createTable('cards', (table) => {
    table.increments('id').primary()
    table.string('user_id').notNullable()
    table.string('species_id').notNullable()
    table.string('image_url').notNullable()
    table.string('location')
    table.timestamp('created_at').defaultTo(knex.fn.now()) // default time created to 'now'

    table.foreign('user_id').references('id').inTable('users')
    table.foreign('species_id').references('id').inTable('species')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('cards')
}

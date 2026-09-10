/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.createTable('gallery', (table) => {
    table.increments('id').primary()
    table.string('user_id').notNullable()
    table.string('image_url').notNullable()
    table.string('caption')
    table.timestamp('created_at').defaultTo(knex.fn.now()) // default time created to 'now'

    table.foreign('user_id').references('id').inTable('users')
  })
}

export async function down(knex) {
  await knex.schema.dropTable('gallery')
}

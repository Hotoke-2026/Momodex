/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.createTable('species', (table) => {
    table.string('id').primary()
    table.string('name').notNullable()
    table.string('type').notNullable() // bird / insect / plant
    table.integer('hp').notNullable()
    table.integer('attack').notNullable()
    table.string('rarity').notNullable()
    table.string('status').notNullable() // native / invasive
  })
}

export async function down(knex) {
  await knex.schema.dropTable('species')
}

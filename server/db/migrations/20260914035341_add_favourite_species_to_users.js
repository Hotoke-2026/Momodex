/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('favourite_species_id').nullable()
    table.foreign('favourite_species_id').references('id').inTable('species')
  })
}

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropForeign('favourite_species_id')
    table.dropColumn('favourite_species_id')
  })
}
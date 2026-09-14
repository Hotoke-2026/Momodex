/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.string('fun_fact')
  })
}

export async function down(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.dropColumn('fun_fact')
  })
}

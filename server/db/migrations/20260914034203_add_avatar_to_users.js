/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('avatar_url').nullable()
  })
}

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('avatar_url')
  })
}
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('currently_seeking').nullable()
    table.timestamp('created_at').nullable()
  })
}

export async function down(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('currently_seeking')
    table.dropColumn('created_at')
  })
}

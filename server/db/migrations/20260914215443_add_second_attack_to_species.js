/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.string('attack_name') // name of the existing 'attack' stat, e.g. "Wing Attack"
    table.string('attack_two_name') // name of the new second attack
    table.integer('attack_two') // damage of the new second attack
  })
}

export async function down(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.dropColumn('attack_name')
    table.dropColumn('attack_two_name')
    table.dropColumn('attack_two')
  })
}

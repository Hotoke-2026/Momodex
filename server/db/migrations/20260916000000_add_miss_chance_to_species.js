/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.integer('attack_miss_chance').notNullable().defaultTo(5) // % chance the basic attack misses
    table.integer('attack_two_miss_chance') // % chance the special attack misses, null if there's no second move
  })
}

export async function down(knex) {
  await knex.schema.alterTable('species', (table) => {
    table.dropColumn('attack_miss_chance')
    table.dropColumn('attack_two_miss_chance')
  })
}

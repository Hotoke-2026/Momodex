/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 *
 **/

export async function up(knex){
  return knex.schema.createTable('achievements', (table) => {
    table.string('id').primary()
    table.string('user_id').notNullable().references('id').inTable('users')
    table.string('type').notNullable()
    table.string('name')
    table.timestamp('unlocked_at').defaultTo(knex.fn.now())
  })
}

export async function down(knex) {
  return knex.schema.dropTable('achievements')
}
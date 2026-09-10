/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex('cards').del()
  await knex('users').del()

  await knex('users').insert([{ id: 'user1', name: 'David' }])
}

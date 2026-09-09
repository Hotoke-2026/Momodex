/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex('users').del()

  await knex('users').insert([{ id: 'auth0|user1', name: 'David' }])
}

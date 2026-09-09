/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex('cards').del()

  await knex('cards').insert([
    {
      user_id: 'user1',
      species_id: 'tui',
      image_url: 'https://placehold.co/400x400?text=Tui',
      location: 'Waitakere Ranges',
    },
    {
      user_id: 'user1',
      species_id: 'possum',
      image_url: 'https://placehold.co/400x400?text=Possum',
      location: 'Backyard, Auckland',
    },
    {
      user_id: 'user1',
      species_id: 'kea',
      image_url: 'https://placehold.co/400x400?text=Kea',
      location: "Arthur's Pass",
    },
    {
      user_id: 'user1',
      species_id: 'weta',
      image_url: 'https://placehold.co/400x400?text=Weta',
      location: 'Backyard, Wellington',
    },
    {
      user_id: 'user1',
      species_id: 'stoat',
      image_url: 'https://placehold.co/400x400?text=Stoat',
      location: 'Fiordland',
    },
    {
      user_id: 'user1',
      species_id: 'gorse',
      image_url: 'https://placehold.co/400x400?text=Gorse',
      location: 'Rural roadside',
    },
  ])
}

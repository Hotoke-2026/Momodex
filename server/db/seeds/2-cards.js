/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function seed(knex) {
  await knex('cards').del()

  await knex('cards').insert([
    {
      id: 1,
      card_name: 'Tui',
      user_id: 'user1',
      species_id: 'tui',
      image_url: 'https://placehold.co/400x400?text=Tui',
      location: 'Waitakere Ranges',
      created_at: new Date('2026-01-10T10:00:00Z'),
    },
    {
      id: 2,
      card_name: 'Possum',
      user_id: 'user1',
      species_id: 'possum',
      image_url: 'https://placehold.co/400x400?text=Possum',
      location: 'Backyard, Auckland',
      created_at: new Date('2026-01-11T11:30:00Z'),
    },
    {
      id: 3,
      card_name: 'Kea',
      user_id: 'user1',
      species_id: 'kea',
      image_url: 'https://placehold.co/400x400?text=Kea',
      location: "Arthur's Pass",
      created_at: new Date('2026-01-12T14:15:00Z'),
    },
    {
      id: 4,
      card_name: 'Weta',
      user_id: 'user1',
      species_id: 'weta',
      image_url: 'https://placehold.co/400x400?text=Weta',
      location: 'Backyard, Wellington',
      created_at: new Date('2026-01-13T09:45:00Z'),
    },
    {
      id: 5,
      card_name: 'Stoat',
      user_id: 'user1',
      species_id: 'stoat',
      image_url: 'https://placehold.co/400x400?text=Stoat',
      location: 'Fiordland',
      created_at: new Date('2026-01-14T16:20:00Z'),
    },
    {
      id: 6,
      card_name: 'Gorse',
      user_id: 'user1',
      species_id: 'gorse',
      image_url: 'https://placehold.co/400x400?text=Gorse',
      location: 'Rural roadside',
      created_at: new Date('2026-01-15T12:00:00Z'),
    },
  ])
}
import db from '../connection.js'

export async function seed() {
  await db.execute('DELETE FROM cards')

  await db.execute({
    sql: `
      INSERT INTO cards (id, card_name, user_id, species_id, image_url, location, created_at)
      VALUES 
      (1, 'Tui', 'user1', 'tui', 'https://placehold.co/400x400?text=Tui', 'Waitakere Ranges', '2026-01-10 10:00:00'),
      (2, 'Possum', 'user1', 'possum', 'https://placehold.co/400x400?text=Possum', 'Backyard, Auckland', '2026-01-11 11:30:00'),
      (3, 'Kea', 'user1', 'kea', 'https://placehold.co/400x400?text=Kea', 'Arthur''s Pass', '2026-01-12 14:15:00'),
      (4, 'Weta', 'user1', 'weta', 'https://placehold.co/400x400?text=Weta', 'Backyard, Wellington', '2026-01-13 09:45:00'),
      (5, 'Stoat', 'user1', 'stoat', 'https://placehold.co/400x400?text=Stoat', 'Fiordland', '2026-01-14 16:20:00'),
      (6, 'Gorse', 'user1', 'gorse', 'https://placehold.co/400x400?text=Gorse', 'Rural roadside', '2026-01-15 12:00:00')
    `,
  })
}
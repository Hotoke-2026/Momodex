import db from '../connection.js'

export async function seed() {
  await db.execute('DELETE FROM species')

  await db.execute({
    sql: `
      INSERT INTO species (
        id, name, type, hp, attack, attack_name, attack_two, attack_two_name, 
        attack_miss_chance, attack_two_miss_chance, rarity, status, description, 
        fun_fact, effect_type, effect_value, effect_trigger
      ) VALUES 
      (
        'kiwi', 'Kiwi', 'bird', 28, 10, 'Peck', 18, 'Burrow Strike', 
        5, 15, 'rare', 'native', 
        'A flightless, nocturnal icon of New Zealand known for its keen sense of smell and strong burrowing legs.', 
        'Kiwi are the only birds in the world with nostrils at the tip of their beak, letting them sniff out worms underground.', 
        'dodge', 25, 'passive'
      ),
      (
        'tui', 'Tūī', 'bird', 26, 16, 'Song Blast', 12, 'Wing Buffet', 
        5, 15, 'common', 'native', 
        'A energetic honeyeater with distinctive white throat plumes and an exceptionally loud, complex song.', 
        'Tūī have two voice boxes, letting them sing two different notes at the same time.', 
        'dodge', 25, 'passive'
      )
      -- (Add remaining species rows here or keep them in your migration script)
    `,
  })
}
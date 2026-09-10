// shared/types.ts

export interface User {
  id: string
  name: string
}

export interface Species {
  id: string
  name: string
  type: string // 'bird' | 'insect' | 'plant' |
  hp: number
  attack: number
  rarity: string // 'common' | 'rare' | 'legendary'
  status: string // 'native' | 'invasive'
  description: string
}

export interface Card {
  id: number
  card_name: string
  user_id: string
  species_id: string
  image_url: string
  location: string | null
  created_at: string
}

// DTO = Data Transfer Object.
// This describes the shape of data the CLIENT SENDS to create a card,
// which is different from the Card shape above (what's returned FROM the DB).
// It excludes `id` and `created_at` because those are generated
// automatically by SQLite on insert — the client never provides them.
export interface CreateCardDTO {
  user_id: string
  species_id: string
  image_url: string
  location?: string
}

export type NewCardPayload = Omit<Card, 'id' | 'user_id'>

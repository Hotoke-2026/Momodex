// shared/types.ts

export interface User {
  id: string
  name: string
  avatar_url?: string | null
  favourite_species?: string | null
  currently_seeking?: string | null
  created_at?: string | null
}

export interface Species {
  id: string
  name: string
  type: string // 'bird' | 'insect' | 'plant' |
  hp: number
  attack: number
  attack_name: string
  attack_two: number | null
  attack_two_name: string | null
  rarity: string // 'common' | 'rare' | 'legendary'
  status: string // 'native' | 'invasive'
  description: string
  fun_fact: string
  effect_type: string | null
  effect_value: number | null
  effect_trigger: string | null
  attack_miss_chance: number
  attack_two_miss_chance: number | null
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

export interface CardWithSpecies {
  card: Card
  species: Species
}

// This describes the shape of data the CLIENT SENDS to create a card,
// which is different from the Card shape above (what's returned FROM the DB).
// It excludes `id` and `created_at` because those are generated
// automatically by SQLite on insert — the client never provides them.
export interface NewCard {
  card_name: string
  user_id: string
  species_id: string
  image_url: string
  location?: string | null
}

export type NewCardPayload = Omit<Card, 'id' | 'user_id'>

export interface GalleryImage {
  id: number
  user_id: string
  image_url: string
  caption: string | null
  created_at: string
}

export interface CreateGalleryImageDTO {
  user_id: string
  image_url: string
  caption?: string
}

export interface Achievement {
  id: string
  user_id: string
  type: string
  name: string
  unlocked_at: string
}

export interface AchievementDefinition {
  type: string
  name: string
  description: string
}

export interface AchievementWithStatus extends AchievementDefinition {
  unlocked: boolean
  unlocked_at: string | null
}

export interface BattleStats {
  user_id: string
  wins: number
  losses: number
}

export interface LastCapture {
  created_at: string
  location: string | null
}

import type { Species } from '../../models/types'

// Used only as initialState before the real player/opponent species load —
// never shown to the user, just needs to satisfy BattleState's shape.
export const placeholderPlayerSpecies: Species = {
  id: 'tui',
  name: 'Tūī',
  type: 'bird',
  hp: 20,
  attack: 14,
  attack_name: 'Sharp Peck',
  attack_two: 18,
  attack_two_name: 'Aerial Dive',
  rarity: 'common',
  status: 'native',
  description: 'A native NZ bird known for its distinctive song.',
  fun_fact:
    'Tūī have two voice boxes, letting them sing two different notes at the same time.',
  effect_type: null,
  effect_value: null,
  effect_trigger: null,
}

export const placeholderOpponentSpecies: Species = {
  id: 'possum',
  name: 'Common Brushtail Possum',
  type: 'mammal',
  hp: 32,
  attack: 17,
  attack_name: 'Claw Swipe',
  attack_two: 21,
  attack_two_name: 'Vicious Bite',
  rarity: 'common',
  status: 'invasive',
  description: 'An invasive species that damages native forests.',
  fun_fact:
    'A single possum can eat around 21,000 leaves a year, stripping native trees bare over time.',
  effect_type: null,
  effect_value: null,
  effect_trigger: null,
}

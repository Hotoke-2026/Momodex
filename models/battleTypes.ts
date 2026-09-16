import type { Species } from '../models/types'
export interface BattleCombatant {
  species: Species
  currentHp: number // starts equal to species.hp, decreases as battle progresses
  level: number // 1-4, based on captures count
}

export interface BattleState {
  player: BattleCombatant // the player's chosen species
  ai: BattleCombatant // the AI opponent
  turn: 'player' | 'ai' // whose turn it is to act
  log: string[] // describe the battle events that have occurred so far, in order
  isGameOver: boolean // true if either combatant's currentHp <= 0
  winner: 'player' | 'ai' | null // null if the battle is still ongoing
  playerPoison: PoisonStatus | null
  aiPoison: PoisonStatus | null
  lastEvent: Array<{
    target: 'player' | 'ai'
    cause: 'attack' | 'poison'
    attackerType?: string
  }>
}

export type BattleAction =
  | { type: 'ATTACK' }
  | { type: 'ATTACK_TWO' }
  | { type: 'AI_COUNTER' }
  | { type: 'RESET' }
  | { type: 'SET_OPPONENT'; species: Species; level: number } // the player attacks, the AI counterattacks, or the battle is reset
  | { type: 'SET_PLAYER_LEVEL'; level: number }

export interface PoisonStatus {
  damage: number
  turnsRemaining: number
}

export type SpeciesType =
  'bird' | 'herp' | 'insect' | 'plant' | 'fungi' | 'mammal'

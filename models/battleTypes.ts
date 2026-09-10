import type { Species } from '../models/types'
export interface BattleCombatant {
  species: Species
  currentHp: number // starts equal to species.hp, decreases as battle progresses
}

export interface BattleState {
  player: BattleCombatant // the player's chosen species
  ai: BattleCombatant // the AI opponent
  turn: 'player' | 'ai' // whose turn it is to act
  log: string[] // describe the battle events that have occurred so far, in order
  isGameOver: boolean // true if either combatant's currentHp <= 0
  winner: 'player' | 'ai' | null // null if the battle is still ongoing
}

export type BattleAction =
  { type: 'ATTACK' } | { type: 'AI_COUNTER' } | { type: 'RESET' } // the player attacks, the AI counterattacks, or the battle is reset

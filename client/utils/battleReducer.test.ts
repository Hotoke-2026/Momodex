import { describe, expect, it } from 'vitest'
import { battleReducer } from './battleReducer'
import type { BattleState, BattleAction } from '../../models/battleTypes'
import type { Species } from '../../models/types'

describe('battleReducer', () => {
  const playerSpecies: Species = {
    id: 'test-player',
    name: 'PlayerSpecies',
    type: 'bird',
    hp: 100,
    attack: 20,
    rarity: 'common',
    status: 'native',
    description: 'A test species',
  }

  const aiSpecies: Species = {
    id: 'test-ai',
    name: 'AISpecies',
    type: 'mammal',
    hp: 80,
    attack: 15,
    rarity: 'common',
    status: 'invasive',
    description: 'A test species',
  }

  const initialState: BattleState = {
    player: { species: playerSpecies, currentHp: playerSpecies.hp },
    ai: { species: aiSpecies, currentHp: aiSpecies.hp },
    turn: 'player',
    log: [],
    isGameOver: false,
    winner: null,
  }

  it('should handle ATTACK action', () => {
    const action: BattleAction = { type: 'ATTACK' }
    const newState = battleReducer(initialState, action)

    expect(newState.ai.currentHp).toBe(60)
    expect(newState.log).toContain(
      `${playerSpecies.name} attacks ${aiSpecies.name} for ${playerSpecies.attack} damage!`,
    )
    expect(newState.turn).toBe('ai')
  })

  it('should handle AI_COUNTER action', () => {
    const stateAfterPlayerAttack: BattleState = {
      ...initialState,
      ai: { species: aiSpecies, currentHp: 60 },
      turn: 'ai',
    }

    const action: BattleAction = { type: 'AI_COUNTER' }
    const newState = battleReducer(stateAfterPlayerAttack, action)

    expect(newState.player.currentHp).toBe(85)
    expect(newState.log).toContain(
      `${aiSpecies.name} attacks ${playerSpecies.name} for ${aiSpecies.attack} damage!`,
    )
    expect(newState.turn).toBe('player')
  })

  it('should handle RESET action', () => {
    const stateAfterBattle: BattleState = {
      ...initialState,
      player: { species: playerSpecies, currentHp: 50 },
      ai: { species: aiSpecies, currentHp: 30 },
      log: ['Some battle log'],
      isGameOver: true,
      winner: 'player',
    }

    const action: BattleAction = { type: 'RESET' }
    const newState = battleReducer(stateAfterBattle, action)

    expect(newState.player.currentHp).toBe(playerSpecies.hp)
    expect(newState.ai.currentHp).toBe(aiSpecies.hp)
    expect(newState.log).toEqual([])
    expect(newState.isGameOver).toBe(false)
    expect(newState.winner).toBe(null)
  })
})

import { describe, expect, it, afterEach, vi } from 'vitest'
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
    attack_name: 'Attack',
    attack_miss_chance: 5,
    attack_two: 30,
    attack_two_name: 'Strong Attack',
    attack_two_miss_chance: 15,
    rarity: 'common',
    status: 'native',
    description: 'A test species',
    fun_fact: 'A test species',
    effect_type: null,
    effect_value: null,
    effect_trigger: null,
  }

  const aiSpecies: Species = {
    id: 'test-ai',
    name: 'AISpecies',
    type: 'bird',
    hp: 80,
    attack: 15,
    attack_name: 'Attack',
    attack_miss_chance: 5,
    attack_two: 25,
    attack_two_name: 'Strong Attack',
    attack_two_miss_chance: 15,
    rarity: 'common',
    status: 'invasive',
    description: 'A test species',
    fun_fact: 'A test species',
    effect_type: null,
    effect_value: null,
    effect_trigger: null,
  }

  const initialState: BattleState = {
    player: { species: playerSpecies, currentHp: playerSpecies.hp, level: 1 },
    ai: { species: aiSpecies, currentHp: aiSpecies.hp, level: 1 },
    turn: 'player',
    log: [],
    isGameOver: false,
    winner: null,
    playerPoison: null,
    aiPoison: null,
  }

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle ATTACK action on a hit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // 50 >= 5% miss chance, so it hits

    const action: BattleAction = { type: 'ATTACK' }
    const newState = battleReducer(initialState, action)

    expect(newState.ai.currentHp).toBe(60)
    expect(newState.log).toContain(
      `${playerSpecies.name} used ${playerSpecies.attack_name} for ${playerSpecies.attack} damage!`,
    )
    expect(newState.turn).toBe('ai')
  })

  it('should handle ATTACK action on a miss', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.01) // 1 < 5% miss chance, so it misses

    const action: BattleAction = { type: 'ATTACK' }
    const newState = battleReducer(initialState, action)

    expect(newState.ai.currentHp).toBe(aiSpecies.hp)
    expect(newState.log).toContain(
      `${playerSpecies.name} used ${playerSpecies.attack_name}, but it missed!`,
    )
    expect(newState.turn).toBe('ai')
  })

  it('should handle ATTACK_TWO action on a hit', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // 50 >= 15% miss chance, so it hits

    const action: BattleAction = { type: 'ATTACK_TWO' }
    const newState = battleReducer(initialState, action)

    expect(newState.ai.currentHp).toBe(50)
    expect(newState.log).toContain(
      `${playerSpecies.name} used ${playerSpecies.attack_two_name} for ${playerSpecies.attack_two} damage!`,
    )
    expect(newState.turn).toBe('ai')
  })

  it('should handle ATTACK_TWO action on a miss', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.1) // 10 < 15% miss chance, so it misses

    const action: BattleAction = { type: 'ATTACK_TWO' }
    const newState = battleReducer(initialState, action)

    expect(newState.ai.currentHp).toBe(aiSpecies.hp)
    expect(newState.log).toContain(
      `${playerSpecies.name} used ${playerSpecies.attack_two_name}, but it missed!`,
    )
    expect(newState.turn).toBe('ai')
  })

  it('should handle AI_COUNTER picking its basic move and hitting', () => {
    const stateAfterPlayerAttack: BattleState = {
      ...initialState,
      turn: 'ai',
    }

    // first roll picks the move (>= 0.5 => basic), second roll is the miss check (>= 5% => hit)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.5)

    const action: BattleAction = { type: 'AI_COUNTER' }
    const newState = battleReducer(stateAfterPlayerAttack, action)

    expect(newState.player.currentHp).toBe(85)
    expect(newState.log).toContain(
      `${aiSpecies.name} used ${aiSpecies.attack_name} for ${aiSpecies.attack} damage!`,
    )
    expect(newState.turn).toBe('player')
  })

  it('should handle AI_COUNTER picking its special move and missing', () => {
    const stateAfterPlayerAttack: BattleState = {
      ...initialState,
      turn: 'ai',
    }

    // first roll picks the move (< 0.5 => special), second roll is the miss check (< 15% => miss)
    vi.spyOn(Math, 'random')
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.01)

    const action: BattleAction = { type: 'AI_COUNTER' }
    const newState = battleReducer(stateAfterPlayerAttack, action)

    expect(newState.player.currentHp).toBe(playerSpecies.hp)
    expect(newState.log).toContain(
      `${aiSpecies.name} used ${aiSpecies.attack_two_name}, but it missed!`,
    )
    expect(newState.turn).toBe('player')
  })

  it('should handle RESET action', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const stateAfterBattle: BattleState = {
      ...initialState,
      player: { species: playerSpecies, currentHp: 50, level: 1 },
      ai: { species: aiSpecies, currentHp: 30, level: 1 },
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
    expect(newState.playerPoison).toBe(null)
    expect(newState.aiPoison).toBe(null)
  })

  it('should not mutate the original state object when ATTACK is dispatched', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5)

    const originalAiHp = initialState.ai.currentHp
    const originalLogLength = initialState.log.length
    const originalTurn = initialState.turn

    const action: BattleAction = { type: 'ATTACK' }
    battleReducer(initialState, action)

    expect(initialState.ai.currentHp).toBe(originalAiHp)
    expect(initialState.log.length).toBe(originalLogLength)
    expect(initialState.turn).toBe(originalTurn)
  })

  it('should set isGameOver and winner when an attack brings HP to exactly 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5) // guaranteed hit

    const lowHpState: BattleState = {
      ...initialState,
      ai: { species: aiSpecies, currentHp: 20, level: 1 }, // exactly equal to player's attack (20)
    }

    const action: BattleAction = { type: 'ATTACK' }
    const newState = battleReducer(lowHpState, action)

    expect(newState.ai.currentHp).toBe(0)
    expect(newState.isGameOver).toBe(true)
    expect(newState.winner).toBe('player')
  })
})

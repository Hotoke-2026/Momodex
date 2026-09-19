import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useAiTurn } from './use-ai-turn'
import type { BattleState } from '../../models/battleTypes'
import type { Species } from '../../models/types'

describe('useAiTurn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  const playerSpecies: Species = {
    id: 'test-player',
    name: 'PlayerSpecies',
    type: 'bird',
    hp: 100,
    attack: 20,
    rarity: 'common',
    status: 'native',
    description: 'A test species',
    fun_fact: 'This is a fun fact about the player species.',
    attack_name: '',
    attack_miss_chance: 0,
    attack_two: null,
    attack_two_name: null,
    attack_two_miss_chance: null,
    effect_type: null,
    effect_value: null,
    effect_trigger: null
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
    fun_fact: 'This is a fun fact about the AI species.',
    attack_name: '',
    attack_miss_chance: 0,
    attack_two: null,
    attack_two_name: null,
    attack_two_miss_chance: null,
    effect_type: null,
    effect_value: null,
    effect_trigger: null
  }

  it('dispatches AI_COUNTER after a 1.5s delay when it becomes the AI turn', () => {
    const dispatch = vi.fn()
    const state: BattleState = {
      player: {
        species: playerSpecies, currentHp: 100,
        level: 0
      },
      ai: {
        species: aiSpecies, currentHp: 80,
        level: 0
      },
      turn: 'ai',
      log: [],
      isGameOver: false,
      winner: null,
      playerPoison: null,
      aiPoison: null,
      lastEvent: []
    }

    renderHook(() => useAiTurn(state, dispatch))

    // dispatch should NOT have fired yet, since no time has passed
    expect(dispatch).not.toHaveBeenCalled()

    // fast-forward 1500ms instantly
    vi.advanceTimersByTime(1500)

    // NOW it should have fired
    expect(dispatch).toHaveBeenCalledWith({ type: 'AI_COUNTER' })
    expect(dispatch).toHaveBeenCalledTimes(1)
  })

  it('does NOT dispatch AI_COUNTER when it is the player turn', () => {
    const dispatch = vi.fn()
    const state: BattleState = {
      player: {
        species: playerSpecies, currentHp: 100,
        level: 0
      },
      ai: {
        species: aiSpecies, currentHp: 80,
        level: 0
      },
      turn: 'player', // not the AI's turn
      log: [],
      isGameOver: false,
      winner: null,
      playerPoison: null,
      aiPoison: null,
      lastEvent: []
    }

    renderHook(() => useAiTurn(state, dispatch))
    vi.advanceTimersByTime(5000) // even if we wait a long time

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('does NOT dispatch AI_COUNTER when the game is already over', () => {
    const dispatch = vi.fn()
    const state: BattleState = {
      player: {
        species: playerSpecies, currentHp: 100,
        level: 0
      },
      ai: {
        species: aiSpecies, currentHp: 0,
        level: 0
      },
      turn: 'ai',
      log: [],
      isGameOver: true, // game already ended
      winner: 'player',
      playerPoison: null,
      aiPoison: null,
      lastEvent: []
    }

    renderHook(() => useAiTurn(state, dispatch))
    vi.advanceTimersByTime(1500)

    expect(dispatch).not.toHaveBeenCalled()
  })

  it('cancels the pending timer on unmount, so dispatch never fires afterward', () => {
    const dispatch = vi.fn()
    const state: BattleState = {
      player: {
        species: playerSpecies, currentHp: 100,
        level: 0
      },
      ai: {
        species: aiSpecies, currentHp: 80,
        level: 0
      },
      turn: 'ai',
      log: [],
      isGameOver: false,
      winner: null,
      playerPoison: null,
      aiPoison: null,
      lastEvent: []
    }

    const { unmount } = renderHook(() => useAiTurn(state, dispatch))

    // simulate the component disappearing (e.g. navigating away) BEFORE the timer fires
    unmount()

    // now fast-forward — the timer should have been cleared by cleanup, so nothing fires
    vi.advanceTimersByTime(1500)

    expect(dispatch).not.toHaveBeenCalled()
  })
})

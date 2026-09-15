import type { BattleState, BattleAction } from '../../models/battleTypes'
import { getLeveledStat } from '../utils/getLeveledStat'

export const battleReducer = (
  state: BattleState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'ATTACK': {
      if (state.turn !== 'player' || state.isGameOver) {
        return state
      }
      const damage = getLeveledStat(
        state.player.species.attack,
        state.player.level,
      )
      const newAiHp = Math.max(0, state.ai.currentHp - damage)
      const logEntry = `${state.player.species.name} attacks ${state.ai.species.name} for ${damage} damage!`
      const isGameOver = newAiHp <= 0
      const winner = isGameOver ? 'player' : null

      return {
        ...state,
        ai: { ...state.ai, currentHp: newAiHp },
        log: [...state.log, logEntry],
        isGameOver,
        winner,
        turn: isGameOver ? state.turn : 'ai',
      }
    }
    case 'AI_COUNTER': {
      if (state.turn !== 'ai' || state.isGameOver) {
        return state
      }
      const damage = getLeveledStat(state.ai.species.attack, state.ai.level)
      const newPlayerHp = Math.max(0, state.player.currentHp - damage)
      const logEntry = `${state.ai.species.name} attacks ${state.player.species.name} for ${damage} damage!`
      const isGameOver = newPlayerHp <= 0
      const winner = isGameOver ? 'ai' : null

      return {
        ...state,
        player: { ...state.player, currentHp: newPlayerHp },
        log: [...state.log, logEntry],
        isGameOver,
        winner,
        turn: isGameOver ? state.turn : 'player',
      }
    }
    case 'RESET': {
      return {
        player: {
          ...state.player,
          currentHp: getLeveledStat(
            state.player.species.hp,
            state.player.level,
          ),
        },
        ai: {
          ...state.ai,
          currentHp: getLeveledStat(state.ai.species.hp, state.ai.level),
        },
        turn: 'player',
        log: [],
        isGameOver: false,
        winner: null,
      }
    }
    case 'SET_OPPONENT': {
      const leveledHp = getLeveledStat(action.species.hp, action.level)
      return {
        ...state,
        ai: {
          species: action.species,
          currentHp: leveledHp,
          level: action.level,
        },
      }
    }
    case 'SET_PLAYER_LEVEL': {
      return {
        ...state,
        player: {
          ...state.player,
          level: action.level,
          currentHp: getLeveledStat(state.player.species.hp, action.level),
        },
      }
    }

    default:
      return state
  }
}

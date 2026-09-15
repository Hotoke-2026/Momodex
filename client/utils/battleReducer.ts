import type { BattleState, BattleAction } from '../../models/battleTypes'
import { getLeveledStat } from '../utils/getLeveledStat'

export const battleReducer = (
  state: BattleState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'ATTACK': {
      if (state.turn !== 'player' || state.isGameOver) {
        return state // ignore if it's not the player's turn or the game is over
      }
      // this determines how much damage the player does to the AI
      const damage = getLeveledStat(
        state.player.species.attack,
        state.player.level,
      )
      // this determines the new HP of the AI after taking damage
      const newAiHp = Math.max(0, state.ai.currentHp - damage)
      const logEntry = `${state.player.species.name} attacks ${state.ai.species.name} for ${damage} damage!`
      // this determines if the game is over and who the winner is
      const isGameOver = newAiHp <= 0
      // this determines the winner of the game if it is over
      const winner = isGameOver ? 'player' : null

      return {
        // return a new state object with the updated AI HP, log, game over status, winner, and turn
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
        return state // ignore if it's not the AI's turn or the game is over
      }
      // this determines how much damage the AI does to the player
      const damage = getLeveledStat(state.ai.species.attack, state.ai.level)
      // this determines the new HP of the player after taking damage
      const newPlayerHp = Math.max(0, state.player.currentHp - damage)
      const logEntry = `${state.ai.species.name} attacks ${state.player.species.name} for ${damage} damage!`
      // this determines if the game is over and who the winner is
      const isGameOver = newPlayerHp <= 0
      // this determines the winner of the game if it is over
      const winner = isGameOver ? 'ai' : null

      return {
        // return a new state object with the updated player HP, log, game over status, winner, and turn
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

    default:
      return state
  }
}

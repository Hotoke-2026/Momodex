import type { BattleState, BattleAction } from '../../models/battleTypes'
import { getTypeMultiplier } from './typeChart'

export const battleReducer = (
  state: BattleState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'ATTACK': {
      if (state.turn !== 'player' || state.isGameOver) {
        return state // ignore if it's not the player's turn or the game is over
      }
      // determines the type-effectiveness multiplier for this attack
      const multiplier = getTypeMultiplier(
        state.player.species.type,
        state.ai.species.type,
      )
      // this determines how much damage the player does to the AI
      const damage = Math.round(state.player.species.attack * multiplier)
      // this determines the new HP of the AI after taking damage
      const newAiHp = Math.max(0, state.ai.currentHp - damage)
      let logEntry = `${state.player.species.name} attacks ${state.ai.species.name} for ${damage} damage!`
      if (multiplier === 1.5) {
        logEntry += " It's super effective!"
      } else if (multiplier === 0.5) {
        logEntry += ' Not very effective...'
      }
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
      // determines the type-effectiveness multiplier for this attack
      const multiplier = getTypeMultiplier(
        state.ai.species.type,
        state.player.species.type,
      )
      // this determines how much damage the AI does to the player
      const damage = Math.round(state.ai.species.attack * multiplier)
      // this determines the new HP of the player after taking damage
      const newPlayerHp = Math.max(0, state.player.currentHp - damage)
      let logEntry = `${state.ai.species.name} attacks ${state.player.species.name} for ${damage} damage!`
      if (multiplier === 1.5) {
        logEntry += " It's super effective!"
      } else if (multiplier === 0.5) {
        logEntry += ' Not very effective...'
      }
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
      // reset the battle state to the initial state
      return {
        player: { ...state.player, currentHp: state.player.species.hp },
        ai: { ...state.ai, currentHp: state.ai.species.hp },
        turn: 'player',
        log: [],
        isGameOver: false,
        winner: null,
      }
    }
    case 'SET_OPPONENT': {
      return {
        ...state,
        ai: { species: action.species, currentHp: action.species.hp },
      }
    }

    default:
      return state
  }
}

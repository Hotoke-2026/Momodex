import { useEffect } from 'react'
import type { Dispatch } from 'react'
import type { BattleState, BattleAction } from '../../models/battleTypes'

export function useAiTurn(
  state: BattleState,
  dispatch: Dispatch<BattleAction>,
) {
  useEffect(() => {
    if (state.turn !== 'ai' || state.isGameOver) return
    // setTimeout gives us back a ticket number for this specific countdown
    // this also determines how long it take for the response of the opponent
    const timer = setTimeout(() => {
      dispatch({ type: 'AI_COUNTER' })
    }, 1200)
    //this can cancels timer if state is either is down bellow
    return () => clearTimeout(timer)
  }, [state.turn, state.isGameOver, dispatch])
}

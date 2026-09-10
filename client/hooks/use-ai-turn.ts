import { useEffect } from 'react'
import type { Dispatch } from 'react'
import type { BattleState, BattleAction } from '../../models/battleTypes'

export function useAiTurn(
  state: BattleState,
  dispatch: Dispatch<BattleAction>,
) {
  useEffect(() => {
    if (state.turn !== 'ai' || state.isGameOver) return
    // setTimeout gives us back a ticket number for this specific countdown,
    const timer = setTimeout(() => {
      dispatch({ type: 'AI_COUNTER' })
    }, 1500)
    //this can cancels timer if state is either is down bellow
    return () => clearTimeout(timer)
  }, [state.turn, state.isGameOver, dispatch])
}

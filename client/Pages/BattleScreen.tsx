import { useEffect, useReducer, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { battleReducer } from '../utils/battleReducer'
import { useNavigate } from 'react-router'
import { MatchResultLayout } from '../components/MatchResultLayout'
import { CardFrame } from '../components/CardFrame'
import { useAiTurn } from '../hooks/use-ai-turn'
import { useQuery } from '@tanstack/react-query'
import { getAllSpecies, getSpeciesById } from '../apis/species'
import { getRandomOpponent } from '../utils/getRandomOpponent'
import '../styles/index.css'
import '../styles/index.scss'
import { useCheckAchievements } from '../hooks/useAchievements'
import type { BattleState } from '../../models/battleTypes'
import type { Card, Species } from '../../models/types'
import { NavBar } from '../components/NavBar'

// player side is still a placeholder — real card selection is a separate ticket
const tui: Species = {
  id: 'tui',
  name: 'Tūī',
  type: 'bird',
  hp: 20,
  attack: 14,
  rarity: 'common',
  status: 'native',
  description: 'A native NZ bird known for its distinctive song.',
  fun_fact:
    'Tūī have two voice boxes, letting them sing two different notes at the same time.',
}

// starting AI species — immediately replaced once the real random opponent loads
const possum: Species = {
  id: 'possum',
  name: 'Common Brushtail Possum',
  type: 'mammal',
  hp: 32,
  attack: 17,
  rarity: 'common',
  status: 'invasive',
  description: 'An invasive species that damages native forests.',
  fun_fact: '',
}

const initialState: BattleState = {
  player: { species: tui, currentHp: tui.hp },
  ai: { species: possum, currentHp: possum.hp },
  turn: 'player',
  log: [],
  isGameOver: false,
  winner: null,
}

export function BattleScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, user: auth0User } = useAuth0()
  const userId = auth0User?.sub ?? 'test'

  // Step 1: get the full species pool (public catalog data)
  const speciesListQuery = useQuery({
    queryKey: ['species'],
    queryFn: () => getAllSpecies(),
  })

  // Step 2: once the pool arrives, pick ONE random opponent id (only once)
  const [opponentId, setOpponentId] = useState<string | null>(null)
  useEffect(() => {
    if (speciesListQuery.data && Array.isArray(speciesListQuery.data) && !opponentId) {
      const picked = getRandomOpponent(speciesListQuery.data)
      if (picked) {
        setOpponentId(picked.id)
      }
    }
  }, [speciesListQuery.data, opponentId])

  // Step 3: fetch full stats for that one chosen id (public catalog data)
  const opponentSpeciesQuery = useQuery({
    queryKey: ['species', opponentId],
    queryFn: () => getSpeciesById(opponentId as string),
    enabled: !!opponentId,
  })

  const placeholderCard: Card = {
    id: 0,
    card_name: 'Placeholder Card',
    user_id: userId,
    species_id: '',
    image_url: '',
    location: null,
    created_at: new Date().toISOString(),
  }

  const [state, dispatch] = useReducer(battleReducer, initialState)

  // Step 3b: once the real opponent's full data arrives, swap it into battle state
  useEffect(() => {
    if (opponentSpeciesQuery.data) {
      dispatch({ type: 'SET_OPPONENT', species: opponentSpeciesQuery.data })
    }
  }, [opponentSpeciesQuery.data])

  const checkAchievementsMutation = useCheckAchievements(userId)
  const hasSentBattleResult = useRef(false)

  useAiTurn(state, dispatch)

  const isPlayerTurn = state.turn === 'player' && !state.isGameOver

  useEffect(() => {
    if (!state.isGameOver || !state.winner) {
      hasSentBattleResult.current = false
      return
    }
    if (hasSentBattleResult.current) return
    hasSentBattleResult.current = true

    if (isAuthenticated) {
      checkAchievementsMutation.mutate({
        winner: state.winner,
        opponentWasInvasive: state.ai.species.status === 'invasive',
      })
    }
  }, [
    state.isGameOver,
    state.winner,
    state.ai.species.status,
    checkAchievementsMutation,
    isAuthenticated,
  ])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-(--color-base)">
        <NavBar />
        <p className="p-6 text-(--color-text-soft)">
          Please log in to start battling.
        </p>
      </div>
    )
  }

  // Step 4: don't show the battle UI until the REAL opponent has loaded
  if (speciesListQuery.isLoading || !opponentSpeciesQuery.data) {
    return (
      <div className="battle-container">
        <NavBar />
        <p className="p-6 text-(--color-text-soft)">Finding an opponent...</p>
      </div>
    )
  }

  return (
    <div className="battle-container">
      <NavBar />
      <div className="battle-container__content">
        <div className="battle-container__header">
          <button
            className="battle-container__retreat-btn"
            onClick={() => navigate('/deck')}
          >
            Retreat
          </button>

          <h1 className="battle-container__title">BATTLE</h1>

          {state.turn === 'ai' && !state.isGameOver ? (
            <span className="battle-container__status-pill">
              Opponent is thinking...
            </span>
          ) : (
            <span className="battle-container__status-text">
              {state.isGameOver ? 'Game Over' : 'Your turn — choose a move'}
            </span>
          )}
        </div>

        <div>
          <div className="battle-container__combatants-labels">
            <span>YOU</span>
            <span>OPPONENT</span>
          </div>
          <div className="battle-container__grid">
            <CardFrame
              card={placeholderCard}
              species={state.player.species}
              currentHp={state.player.currentHp}
              compact={true}
            />
            <CardFrame
              card={placeholderCard}
              species={state.ai.species}
              currentHp={state.ai.currentHp}
              compact={true}
            />
          </div>
        </div>

        <div>
          <p className="battle-container__moves-label">Choose a move:</p>
          <div className="battle-container__moves-grid">
            <button
              className="battle-container__move-btn"
              onClick={() => dispatch({ type: 'ATTACK' })}
              disabled={!isPlayerTurn}
            >
              <div className="move-title">Wing Attack</div>
              <div className="move-dmg">{state.player.species.attack} DMG</div>
            </button>
          </div>
        </div>

        <div className="battle-container__log-box">
          <h3>BATTLE LOG</h3>
          <div className="log-entries">
            {state.log.map((entry, i) => (
              <div key={i}>{entry}</div>
            ))}
          </div>
        </div>
      </div>

      {state.isGameOver && state.winner && (
        <MatchResultLayout
          winner={state.winner}
          onPlayAgain={() => dispatch({ type: 'RESET' })}
          onReturnToDeck={() => navigate('/deck')}
          speciesFact={
            state.winner === 'player'
              ? state.ai.species.fun_fact
              : state.player.species.fun_fact
          }
          speciesName={
            state.winner === 'player'
              ? state.ai.species.name
              : state.player.species.name
          }
        />
      )}
    </div>
  )
}
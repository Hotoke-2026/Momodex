import { useEffect, useMemo, useReducer, useRef } from 'react'
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
import { getCardsByUserId } from '../apis/cards'
import { getCardLevel } from '../utils/getCardLevel'
import { getAiLevel } from '../utils/getAiLevel'

// player side is still a placeholder — real card selection is a separate ticket
const tui: Species = {
  id: 'tui',
  name: 'Tūī',
  type: 'bird',
  hp: 20,
  attack: 14,
  attack_name: 'Sharp Peck',
  attack_two: 18,
  attack_two_name: 'Aerial Dive',
  rarity: 'common',
  status: 'native',
  description: 'A native NZ bird known for its distinctive song.',
  fun_fact:
    'Tūī have two voice boxes, letting them sing two different notes at the same time.',
  effect_type: null,
  effect_value: null,
  effect_trigger: null,
}

// starting AI species — immediately replaced once the real random opponent loads
const possum: Species = {
  id: 'possum',
  name: 'Common Brushtail Possum',
  type: 'mammal',
  hp: 32,
  attack: 17,
  attack_name: 'Claw Swipe',
  attack_two: 21,
  attack_two_name: 'Vicious Bite',
  rarity: 'common',
  status: 'invasive',
  description: 'An invasive species that damages native forests.',
  fun_fact:
    'A single possum can eat around 21,000 leaves a year, stripping native trees bare over time.',
  effect_type: null,
  effect_value: null,
  effect_trigger: null,
}

const placeholderCard: Card = {
  id: 0,
  card_name: 'Placeholder Card',
  user_id: 'test',
  species_id: '',
  image_url: '',
  location: null,
  created_at: new Date().toISOString(),
}

const initialState: BattleState = {
  player: { species: tui, currentHp: tui.hp, level: 1 },
  ai: { species: possum, currentHp: possum.hp, level: 1 },
  turn: 'player',
  log: [],
  isGameOver: false,
  winner: null,
}

const CURRENT_USER_ID = 'user1'

export function BattleScreen() {
  const navigate = useNavigate()

  const speciesListQuery = useQuery({
    queryKey: ['species'],
    queryFn: getAllSpecies,
  })

  // pure derivation from already-loaded data — no effect/setState needed
  const opponentId = useMemo(() => {
    if (!speciesListQuery.data) return null
    return getRandomOpponent(speciesListQuery.data).id
  }, [speciesListQuery.data])

  const opponentSpeciesQuery = useQuery({
    queryKey: ['species', opponentId],
    queryFn: () => getSpeciesById(opponentId as string),
    enabled: !!opponentId,
  })

  const userCardsQuery = useQuery({
    queryKey: ['cards', CURRENT_USER_ID],
    queryFn: () => getCardsByUserId(CURRENT_USER_ID),
  })

  const [state, dispatch] = useReducer(battleReducer, initialState)

  // Once the opponent's data AND the user's cards have both loaded, compute
  // the PLAYER's level from real capture counts, derive the AI's level from
  // that, and apply both to battle state.
  useEffect(() => {
    if (opponentSpeciesQuery.data && userCardsQuery.data) {
      const playerCaptureCount = userCardsQuery.data.filter(
        (c) => c.card.species_id === tui.id,
      ).length
      const playerLevel = getCardLevel(playerCaptureCount)
      const aiLevel = getAiLevel(playerLevel)

      dispatch({ type: 'SET_PLAYER_LEVEL', level: playerLevel })
      dispatch({
        type: 'SET_OPPONENT',
        species: opponentSpeciesQuery.data,
        level: aiLevel,
      })
    }
  }, [opponentSpeciesQuery.data, userCardsQuery.data])

  const checkAchievementsMutation = useCheckAchievements(CURRENT_USER_ID)
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

    checkAchievementsMutation.mutate({
      winner: state.winner,
      opponentWasInvasive: state.ai.species.status === 'invasive',
    })
  }, [
    state.isGameOver,
    state.winner,
    state.ai.species.status,
    checkAchievementsMutation,
  ])

  if (
    speciesListQuery.isLoading ||
    !opponentSpeciesQuery.data ||
    userCardsQuery.isLoading
  ) {
    return (
      <div className="battle-container">
        <p>Finding an opponent...</p>
      </div>
    )
  }

  return (
    <div className="battle-container">
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
              level={state.player.level}
            />
            <CardFrame
              card={placeholderCard}
              species={state.ai.species}
              currentHp={state.ai.currentHp}
              compact={true}
              level={state.ai.level}
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

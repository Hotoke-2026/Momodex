import { useEffect, useReducer, useRef } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { battleReducer } from '../utils/battleReducer'
import { useNavigate } from 'react-router'
import { MatchResultLayout } from '../components/MatchResultLayout'
import { CardFrame } from '../components/CardFrame'
import { useAiTurn } from '../hooks/use-ai-turn'
import '../styles/index.css'
import '../styles/index.scss'
import { useCheckAchievements } from '../hooks/useAchievements'
import type { BattleState } from '../../models/battleTypes'
import type { Card, Species } from '../../models/types'
import { NavBar } from '../components/NavBar'

// these are two species are just for placeholder purposes
// please replace once requirement tickets are done for selecting species from the database
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

const CURRENT_USER_ID = 'user1'

export function BattleScreen() {
  const navigate = useNavigate()
  const { isAuthenticated, user: auth0User } = useAuth0()
  const userId = auth0User?.sub ?? 'test'

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
  const checkAchievementsMutation = useCheckAchievements(CURRENT_USER_ID)
  const hasSentBattleResult = useRef(false)

  useAiTurn(state, dispatch)

  const isPlayerTurn = state.turn === 'player' && !state.isGameOver
  useEffect(() => {
    if (!state.isGameOver || !state.winner) {
      hasSentBattleResult.current = false
      return
    }

    if (hasSentBattleResult.current) {
      return
    }

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <p className="p-6 text-(--color-text-soft)">
          Please log in to participate in battles.
        </p>
      </div>
    )
  }

  return (
    <div className="battle-container">
      <NavBar />
      <div className="battle-container__content">
        {/* Header Section */}
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

        {/* Combatants Grid */}
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

        {/* Action Controls */}
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

        {/* Battle Log Box */}
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
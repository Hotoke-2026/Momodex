import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
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
  attack_name: '',
  attack_two: null,
  attack_two_name: null,
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
  rarity: 'common',
  status: 'invasive',
  description: 'An invasive species that damages native forests.',
  fun_fact:
    'A single possum can eat around 21,000 leaves a year, stripping native trees bare over time.',
  attack_name: '',
  attack_two: null,
  attack_two_name: null,
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
  player: { species: tui, currentHp: tui.hp },
  ai: { species: possum, currentHp: possum.hp },
  turn: 'player',
  log: [],
  isGameOver: false,
  winner: null,
  playerPoison: null,
  aiPoison: null,
}

type BattleAction =
  Parameters<typeof battleReducer>[1] | { type: 'SET_PLAYER'; species: Species }

const screenBattleReducer = (
  state: BattleState,
  action: BattleAction,
): BattleState => {
  if (action.type === 'SET_PLAYER') {
    return {
      ...state,
      player: { species: action.species, currentHp: action.species.hp },
    }
  }

  return battleReducer(state, action)
}

const CURRENT_USER_ID = 'user1'

export function BattleScreen() {
  const navigate = useNavigate()

  //fetch the player's own cards
  const cardsQuery = useQuery({
    queryKey: ['cards', CURRENT_USER_ID],
    queryFn: () => getCardsByUserId(CURRENT_USER_ID),
  })

  //track which card the player picked, before battle starts
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)

  // get the full species pool
  const speciesListQuery = useQuery({
    queryKey: ['species'],
    queryFn: getAllSpecies,
  })

  //once the pool arrives, pick ONE random opponent id (only once)
  const opponentId = useMemo(
    () =>
      speciesListQuery.data
        ? getRandomOpponent(speciesListQuery.data).id
        : null,
    [speciesListQuery.data],
  )

  // fetch full stats for that one chosen id
  const opponentSpeciesQuery = useQuery({
    queryKey: ['species', opponentId],
    queryFn: () => getSpeciesById(opponentId as string),
    enabled: !!opponentId,
  })

  const [state, dispatch] = useReducer(screenBattleReducer, initialState)

  // once the player picks a card, push it into battle state the same way
  const selectedEntry = cardsQuery.data?.find(
    (c) => c.card.id === selectedCardId,
  )
  useEffect(() => {
    if (selectedEntry) {
      dispatch({ type: 'SET_PLAYER', species: selectedEntry.species })
    }
  }, [selectedEntry])

  // Step 3b: once the real opponent's full data arrives, swap it into battle state
  useEffect(() => {
    if (opponentSpeciesQuery.data) {
      dispatch({ type: 'SET_OPPONENT', species: opponentSpeciesQuery.data })
    }
  }, [opponentSpeciesQuery.data])

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

  // Step 4: don't show the battle UI until user chooses card and the REAL opponent has loaded
  if (cardsQuery.isLoading) {
    return (
      <div className="battle-container">
        <p>Loading your deck...</p>
      </div>
    )
  }
  if (cardsQuery.isError) {
    return (
      <div className="battle-container">
        <p>Couldn&apos;t load your deck.</p>
      </div>
    )
  }

  if (!selectedCardId) {
    return (
      <div className="battle-container">
        <div className="battle-container__selection">
          <h1 className="battle-container__selection-title">
            Choose your card
          </h1>
          <p className="battle-container__selection-subtitle">
            Pick a species from your collection to battle with.
          </p>

          <div className="battle-container__selection-grid">
            {cardsQuery.data?.map(({ card, species }) => (
              <button
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className="battle-container__selection-card-btn"
              >
                <CardFrame card={card} species={species} compact />
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // don't proceed to battle UI until BOTH player and opponent have loaded
  if (
    speciesListQuery.isLoading ||
    !opponentSpeciesQuery.data ||
    !selectedEntry
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
              card={selectedEntry.card} // user selected card
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
              <div className="move-title">
                {state.player.species.attack_name || 'Attack'}
              </div>
              <div className="move-dmg">{state.player.species.attack} DMG</div>
            </button>

            {state.player.species.attack_two != null && (
              <button
                className="battle-container__move-btn"
                onClick={() => dispatch({ type: 'ATTACK_TWO' })}
                disabled={!isPlayerTurn}
              >
                <div className="move-title">
                  {state.player.species.attack_two_name}
                </div>
                <div className="move-dmg">
                  {state.player.species.attack_two} DMG
                </div>
                {state.player.species.effect_type && (
                  <div className="move-effect">
                    {state.player.species.effect_type === 'poison' &&
                      '☠️ Poison'}
                    {state.player.species.effect_type === 'lifesteal' &&
                      '💚 Lifesteal'}
                    {state.player.species.effect_type === 'swarm' &&
                      '⚡ Double Hit'}
                  </div>
                )}
              </button>
            )}
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

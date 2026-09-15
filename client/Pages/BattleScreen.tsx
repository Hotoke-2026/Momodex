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
import type { Species } from '../../models/types'
import { getCardsByUserId } from '../apis/cards'
import { getCardLevel } from '../utils/getCardLevel'
import { getAiLevel } from '../utils/getAiLevel'
import { TypeChart } from '../components/TypeChart'

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

const initialState: BattleState = {
  player: { species: tui, currentHp: tui.hp, level: 1 },
  ai: { species: possum, currentHp: possum.hp, level: 1 },
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
      player: {
        ...state.player,
        species: action.species,
        currentHp: action.species.hp,
      },
    }
  }
  return battleReducer(state, action)
}

const CURRENT_USER_ID = 'user1'

export function BattleScreen() {
  const navigate = useNavigate()

  const cardsQuery = useQuery({
    queryKey: ['cards', CURRENT_USER_ID],
    queryFn: () => getCardsByUserId(CURRENT_USER_ID),
  })

  const [showTypeChart, setShowTypeChart] = useState(false)

  const [selectedCardId, setSelectedCardId] = useState<number | null>(null)

  const speciesListQuery = useQuery({
    queryKey: ['species'],
    queryFn: getAllSpecies,
  })

  const opponentId = useMemo(() => {
    if (!speciesListQuery.data) return null
    return getRandomOpponent(speciesListQuery.data).id
  }, [speciesListQuery.data])

  const opponentSpeciesQuery = useQuery({
    queryKey: ['species', opponentId],
    queryFn: () => getSpeciesById(opponentId as string),
    enabled: !!opponentId,
  })

  const [state, dispatch] = useReducer(screenBattleReducer, initialState)

  const selectedEntry = cardsQuery.data?.find(
    (c) => c.card.id === selectedCardId,
  )

  useEffect(() => {
    if (selectedEntry) {
      dispatch({ type: 'SET_PLAYER', species: selectedEntry.species })
    }
  }, [selectedEntry])

  // Once we have the selected card, the opponent, AND the full card list,
  // compute real level from actual capture count and push both levels in.
  useEffect(() => {
    if (selectedEntry && opponentSpeciesQuery.data && cardsQuery.data) {
      const playerCaptureCount = cardsQuery.data.filter(
        (c) => c.card.species_id === selectedEntry.species.id,
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
  }, [selectedEntry, opponentSpeciesQuery.data, cardsQuery.data])

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

          {opponentSpeciesQuery.data ? (
            <div className="battle-container__opponent-preview">
              <p className="battle-container__opponent-preview-label">
                Your opponent:
              </p>
              <p className="battle-container__opponent-preview-name">
                {opponentSpeciesQuery.data.name}
                <span className="battle-container__opponent-preview-type">
                  {' '}
                  ({opponentSpeciesQuery.data.type})
                </span>
              </p>
            </div>
          ) : (
            <p className="battle-container__selection-subtitle">
              Finding an opponent...
            </p>
          )}

          <button
            className="battle-container__type-chart-toggle"
            onClick={() => setShowTypeChart((prev) => !prev)}
          >
            {showTypeChart ? 'Hide type chart' : 'View type chart'}
          </button>

          {showTypeChart && <TypeChart />}

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
              card={selectedEntry.card}
              species={state.player.species}
              currentHp={state.player.currentHp}
              compact={true}
              level={state.player.level}
            />
            <CardFrame
              card={{
                id: 0,
                card_name: state.ai.species.name,
                user_id: 'ai',
                species_id: state.ai.species.id,
                image_url: '',
                location: null,
                created_at: new Date().toISOString(),
              }}
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

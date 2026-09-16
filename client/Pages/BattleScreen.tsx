// client/Pages/BattleScreen.tsx
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { battleReducer } from '../utils/battleReducer'
import { useAiTurn } from '../hooks/use-ai-turn'
import { useCheckAchievements } from '../hooks/useAchievements'
import { getAllSpecies, getSpeciesById } from '../apis/species'
import { getCardsByUserId } from '../apis/cards'
import { getRandomOpponent } from '../utils/getRandomOpponent'
import { getCardLevel } from '../utils/getCardLevel'
import { getAiLevel } from '../utils/getAiLevel'
import { NavBar } from '../components/NavBar'
import { CardSelectionScreen } from '../components/battle/CardSelectionScreen'
import { BattleView } from '../components/battle/BattleView'
import {
  placeholderPlayerSpecies,
  placeholderOpponentSpecies,
} from '../utils/placeholderSpecies'
import '../styles/index.css'
import '../styles/index.scss'
import type { BattleState } from '../../models/battleTypes'
import type { Species } from '../../models/types'
export type BattleAction =
  Parameters<typeof battleReducer>[1] | { type: 'SET_PLAYER'; species: Species }

const initialState: BattleState = {
  player: {
    species: placeholderPlayerSpecies,
    currentHp: placeholderPlayerSpecies.hp,
    level: 1,
  },
  ai: {
    species: placeholderOpponentSpecies,
    currentHp: placeholderOpponentSpecies.hp,
    level: 1,
  },
  turn: 'player',
  log: [],
  isGameOver: false,
  winner: null,
  playerPoison: null,
  aiPoison: null,
  lastEvent: [],
}

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

export function BattleScreen() {
  const navigate = useNavigate()
  const {
    isAuthenticated,
    user: auth0User,
    getAccessTokenSilently,
  } = useAuth0()
  const userId = auth0User?.sub

  const cardsQuery = useQuery({
    queryKey: ['cards', userId],
    queryFn: () => getCardsByUserId(userId as string, getAccessTokenSilently),
    enabled: !!userId,
  })

  const captureCountBySpecies = useMemo(() => {
    const counts: Record<string, number> = {}
    cardsQuery.data?.forEach((c) => {
      counts[c.species.id] = (counts[c.species.id] ?? 0) + 1
    })
    return counts
  }, [cardsQuery.data])

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
    if (selectedEntry)
      dispatch({ type: 'SET_PLAYER', species: selectedEntry.species })
  }, [selectedEntry])

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

  const checkAchievementsMutation = useCheckAchievements(userId ?? '')
  const hasSentBattleResult = useRef(false)
  useAiTurn(state, dispatch)

  const [aiHit, setAiHit] = useState(false)
  const [playerHit, setPlayerHit] = useState(false)
  const [aiAttackerType, setAiAttackerType] = useState<string | null>(null)
  const [playerAttackerType, setPlayerAttackerType] = useState<string | null>(
    null,
  )

  useEffect(() => {
    if (state.lastEvent.length === 0) return
    const timers: ReturnType<typeof setTimeout>[] = []

    state.lastEvent.forEach((event) => {
      if (event.cause !== 'attack') return
      if (event.target === 'ai') {
        setAiAttackerType(event.attackerType ?? null)
        setAiHit(true)
        timers.push(setTimeout(() => setAiHit(false), 600))
      } else {
        setPlayerAttackerType(event.attackerType ?? null)
        setPlayerHit(true)
        timers.push(setTimeout(() => setPlayerHit(false), 600))
      }
    })

    return () => timers.forEach(clearTimeout)
  }, [state.lastEvent])

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
      <>
        <NavBar />
        <div className="battle-container">
          <p className="p-6">Please log in to start battling.</p>
        </div>
      </>
    )
  }
  if (cardsQuery.isLoading) {
    return (
      <>
        <NavBar />
        <div className="battle-container">
          <p>Loading your deck...</p>
        </div>
      </>
    )
  }
  if (cardsQuery.isError) {
    return (
      <>
        <NavBar />
        <div className="battle-container">
          <p>Couldn&apos;t load your deck.</p>
        </div>
      </>
    )
  }

  if (!selectedCardId) {
    return (
      <>
        <NavBar />
        <div className="battle-container">
          <CardSelectionScreen
            cards={cardsQuery.data ?? []}
            captureCountBySpecies={captureCountBySpecies}
            opponentSpecies={opponentSpeciesQuery.data}
            showTypeChart={showTypeChart}
            onToggleTypeChart={() => setShowTypeChart((prev) => !prev)}
            onSelectCard={setSelectedCardId}
          />
        </div>
      </>
    )
  }

  if (
    speciesListQuery.isLoading ||
    !opponentSpeciesQuery.data ||
    !selectedEntry
  ) {
    return (
      <>
        <NavBar />
        <div className="battle-container">
          <p>Finding an opponent...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <BattleView
        state={state}
        dispatch={dispatch}
        selectedCard={selectedEntry.card}
        onRetreat={() => navigate('/deck')}
        onReturnToDeck={() => navigate('/deck')}
        playerHit={playerHit}
        aiHit={aiHit}
        playerAttackerType={playerAttackerType}
        aiAttackerType={aiAttackerType}
      />
    </>
  )
}

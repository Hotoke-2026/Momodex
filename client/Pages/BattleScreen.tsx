import { useReducer } from 'react'
import { battleReducer } from '../utils/battleReducer'
import { useNavigate } from 'react-router'
import { MatchResultLayout } from '../components/MatchResultLayout'
import { CardFrame } from '../components/CardFrame'
import { useAiTurn } from '../hooks/use-ai-turn'
import type { BattleState } from '../../models/battleTypes'
import type { Card, Species } from '../../models/types'

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
  fun_fact:
    'A single possum can eat around 21,000 leaves a year, stripping native trees bare over time.',
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
}
// Temporary on top ^^^

export function BattleScreen() {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(battleReducer, initialState)
  useAiTurn(state, dispatch)

  return (
    <div>
      <h2>Battle</h2>

      <div style={{ display: 'flex', gap: '2rem' }}>
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
      {/* attack button */}
      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => dispatch({ type: 'ATTACK' })}
          disabled={state.turn !== 'player' || state.isGameOver}
        >
          Wing Attack
        </button>

        {/* Play again button */}
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
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

      <div style={{ marginTop: '1rem' }}>
        {/* Battle log */}
        <h3>Battle Log</h3>
        <ul>
          {state.log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

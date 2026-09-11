import { useReducer } from 'react'
import { battleReducer } from '../utils/battleReducer'
import { CardFrame } from '../components/CardFrame'
import type { BattleState } from '../../models/battleTypes'
import type { Card, Species } from '../../models/types'

// these are two species are just for placeholder purposes
// please replace once requirement tickets are done for selecting species from the database
const tui: Species = {
  id: 'tui',
  name: 'Tūī',
  type: 'bird',
  hp: 30,
  attack: 14,
  rarity: 'common',
  status: 'native',
  description: 'A native NZ bird known for its distinctive song.',
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

export default function BattleScreen() {
  const [state, dispatch] = useReducer(battleReducer, initialState)

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

        {/* ai attack button */}
        {/* Temporary SETUP for manual testing only, until BAT-3.1 adds real AI turns */}
        <button
          onClick={() => dispatch({ type: 'AI_COUNTER' })}
          disabled={state.turn !== 'ai' || state.isGameOver}
        >
          |OpponentTurn|
        </button>
        {/* Play again button */}
        <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      </div>

      {state.isGameOver && (
        <p>
          <strong>
            {state.winner === 'player'
              ? 'You won!'
              : 'You lost! try again next time! Champ ;)'}
          </strong>
        </p>
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

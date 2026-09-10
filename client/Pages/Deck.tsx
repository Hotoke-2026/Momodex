// src/pages/Deck.tsx
import { useQuery } from '@tanstack/react-query'
import { CardFrame } from '../components/CardFrame.tsx'
import { getCardsByUserId } from '../apis/cards.ts'
import '../styles/deck.scss'

const CURRENT_USER_ID = 'user1' // hardcoded for now — swap for real auth later

export function Deck() {
  const {
    data: cards,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cards', CURRENT_USER_ID],
    queryFn: () => getCardsByUserId(CURRENT_USER_ID),
  })

  if (isLoading) return <p>Loading your deck...</p>
  if (isError) return <p style={{ color: 'red' }}>{error.message}</p>
  if (!cards || cards.length === 0) {
    return <p>No cards caught yet — go identify some species!</p>
  }

  return (
    <div className="deck-grid">
      {cards.map(({ card, species }) => (
        <CardFrame key={card.id} card={card} species={species} />
      ))}
    </div>
  )
}

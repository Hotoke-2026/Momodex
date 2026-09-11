import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CardFrame } from '../components/CardFrame.tsx'
import { getCardsByUserId } from '../apis/cards.ts'
import '../styles/index.css'

const CURRENT_USER_ID = 'user1'

export function Deck() {
  const [typeFilter, setTypeFilter] = useState('all')

  const {
    data: cards,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cards', CURRENT_USER_ID],
    queryFn: () => getCardsByUserId(CURRENT_USER_ID),
  })

  const types = useMemo(
    () => Array.from(new Set(cards?.map((c) => c.species.type) ?? [])),
    [cards],
  )

  const filteredCards = useMemo(() => {
    if (!cards) return []
    return typeFilter === 'all'
      ? cards
      : cards.filter((c) => c.species.type === typeFilter)
  }, [cards, typeFilter])

  const nativeCount =
    cards?.filter((c) => c.species.status.toLowerCase() === 'native').length ??
    0
  const invasiveCount =
    cards?.filter((c) => c.species.status.toLowerCase() === 'invasive')
      .length ?? 0

  if (isLoading) {
    return (
      <p className="p-6 font-body text-(--colour-text-soft)">
        Loading your deck...
      </p>
    )
  }
  if (isError) {
    return <p className="p-6 text-(--colour-red)">{error.message}</p>
  }

  return (
    <div className="min-h-screen">
      <nav className="top-nav">
        <a href="/" className="top-nav__item">
          🏠<span>Home</span>
        </a>
        <a href="/deck" className="top-nav__item top-nav__item--active">
          🗂️<span>Gallery</span>
        </a>
        <a href="/battle" className="top-nav__item">
          ⚔️<span>Battle</span>
        </a>
        <a href="/map" className="top-nav__item">
          📍<span>Map</span>
        </a>
      </nav>

      <header className="app-header">
        <h1 className="font-display text-(length:--text-heading-md) font-[900] text-(--colour-text)">
          Your Card Deck
        </h1>
        <p className="mt-1 text-(length:--text-body-md)">
          <span className="font-[700] text-(--colour-green)">
            {nativeCount} native
          </span>
          {'  ·  '}
          <span className="font-[700] text-(--colour-red)">
            {invasiveCount} invasive
          </span>
          {'  ·  '}
          {cards?.length ?? 0} total
        </p>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="mt-4 rounded-lg border px-3 py-1.5 text-(length:--text-body-md) capitalize"
          style={{
            borderColor: 'var(--color-tan)',
            backgroundColor: 'var(--color-surface)',
          }}
        >
          <option value="all">All types</option>
          {types.map((t) => (
            <option key={t} value={t} className="capitalize">
              {t}
            </option>
          ))}
        </select>

        <main className="mt-6 pb-12">
          {filteredCards.length === 0 ? (
            <p className="text-(--colour-text-soft)">
              No cards caught yet — go identify some species!
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-15 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCards.map(({ card, species }) => (
                <CardFrame key={card.id} card={card} species={species} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

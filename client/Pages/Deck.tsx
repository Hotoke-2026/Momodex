import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { CardFrame } from '../components/CardFrame.tsx'
import { getCardsByUserId } from '../apis/cards.ts'
import { NavBar } from '../components/NavBar'
import '../styles/index.css'
import { Footer } from '../components/Footer.tsx'

export function Deck() {
  const { user: auth0User, isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently } = useAuth0()
  const userId = auth0User?.sub

  const [typeFilter, setTypeFilter] = useState('all')

  const {
    data: cards,
    isLoading: isCardsLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cards', userId],
    queryFn: () => getCardsByUserId(userId!, getAccessTokenSilently),
    enabled: isAuthenticated && !!userId,
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

  if (isAuthLoading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <p className="p-6 font-body text-(--color-text-soft)">
          Loading session...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <p className="p-6 text-(--color-text-soft)">
          Please log in to view your card deck.
        </p>
      </div>
    )
  }

  if (isCardsLoading) {
    return (
      <div className="min-h-screen">
        <NavBar />
        <p className="p-6 font-body text-(--color-text-soft)">
          Loading your deck...
        </p>
      </div>
    )
  }

  if (isError) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
    return (
      <div className="min-h-screen">
        <NavBar />
        <p className="p-6 text-(--color-red)">{errorMessage}</p>
      </div>
    )
  }

  return (
    <><div className="min-h-screen">
      <NavBar />

      <header className="app-header px-6 py-4">
        <h1 className="font-display text-(length:--text-heading-md) font-black text-(--color-text)">
          Your Card Deck
        </h1>
        <p className="mt-1 text-(length:--text-body-md)">
          <span className="font-bold text-(--color-green)">
            {nativeCount} native
          </span>
          {'  ·  '}
          <span className="font-bold text-(--color-red)">
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
            <p className="text-(--color-text-soft)">
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
    <Footer /></>
  )
}
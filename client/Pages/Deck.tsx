import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { CardFrame } from '../components/CardFrame.tsx'
import { getCardsByUserId } from '../apis/cards.ts'
import { NavBar } from '../components/NavBar'
import { Footer } from '../components/Footer.tsx'
import { useDeleteCard } from '../hooks/useDeleteCard'
import '../styles/index.css'

export function Deck() {
  const {
    user: auth0User,
    isAuthenticated,
    isLoading: isAuthLoading,
    getAccessTokenSilently,
  } = useAuth0()
  const userId = auth0User?.sub

  const [typeFilter, setTypeFilter] = useState('all')
  const [cardPendingDelete, setCardPendingDelete] = useState<number | null>(
    null,
  )

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

  const deleteMutation = useDeleteCard(userId ?? '')

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

  const handleConfirmDelete = () => {
    if (cardPendingDelete != null) {
      deleteMutation.mutate(cardPendingDelete)
      setCardPendingDelete(null)
    }
  }

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
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred'
    return (
      <div className="min-h-screen">
        <NavBar />
        <p className="p-6 text-(--color-red)">{errorMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen">
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
                  <div key={card.id} className="group relative w-fit">
                    <button
                      onClick={() => setCardPendingDelete(card.id)}
                      className="absolute right-3 bottom-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gray-400 text-sm font-bold text-white opacity-0 transition-opacity hover:bg-gray-500 group-hover:opacity-100"
                      aria-label={`Delete ${species.name} card`}
                    >
                      ✕
                    </button>
                    <CardFrame card={card} species={species} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />

      {cardPendingDelete != null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl bg-(--color-surface) p-6 text-center shadow-lg">
            <p className="text-(--text-body-md) text-(--color-text)">
              Are you sure you want to permanently delete this card?
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => setCardPendingDelete(null)}
                className="rounded-md border border-(--color-tan) px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="rounded-md bg-(--color-red) px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

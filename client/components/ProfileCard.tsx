import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllSpecies } from '../apis/species'
import { updateProfileFields } from '../apis/users'
import { ProfileAvatar } from './ProfileAvatar'
import { BattleStatsCard } from './BattleStatsCard'
import type { User, BattleStats, LastCapture } from '../../models/types'
import { useAuth0 } from '@auth0/auth0-react'

interface ProfileCardProps {
  userId: string
  user?: User
  battleStats?: BattleStats
  lastCapture?: LastCapture | null
}

function formatDate(value?: string | null) {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

export function ProfileCard({ userId, user, battleStats, lastCapture }: ProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [favouriteDraft, setFavouriteDraft] = useState('')
  const [seekingDraft, setSeekingDraft] = useState('')
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  const { data: speciesList } = useQuery({
    queryKey: ['species-list'],
    queryFn: () => getAllSpecies(),
    enabled: isEditing,
  })

  const saveMutation = useMutation({
  mutationFn: () =>
    updateProfileFields(
      userId,
      {
        favourite_species: favouriteDraft || user?.favourite_species || '',
        currently_seeking: seekingDraft || user?.currently_seeking || '',
      },
      getAccessTokenSilently
    ),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['user', userId] })
    setIsEditing(false)
  },
})

  const startEditing = () => {
    setFavouriteDraft(user?.favourite_species ?? '')
    setSeekingDraft(user?.currently_seeking ?? '')
    setIsEditing(true)
  }

  return (
    <div className="relative rounded-3xl bg-[var(--color-dark)] p-6">
      <button
        onClick={() => (isEditing ? setIsEditing(false) : startEditing())}
        aria-label={isEditing ? 'Cancel editing profile' : 'Edit profile'}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface)] text-[var(--color-text)]"
      >
        {isEditing ? '✕' : '✎'}
      </button>

      <div className="flex items-start gap-4 pr-12">
  <ProfileAvatar name={user?.name} avatarUrl={user?.avatar_url} size={72} />
  <p className="mt-4 text-[length:var(--text-body-md)] italic text-[var(--color-green-tint)]">
    Momo Collecting since {formatDate(user?.created_at) ?? '—'}
  </p>
</div>

      <h1 className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-heading-lg)] font-black text-[var(--color-surface)]">
        {user?.name ?? 'Loading...'}
      </h1>

      <div className="mt-4 flex flex-col gap-2 text-[length:var(--text-body-md)] text-[var(--color-surface)]">
        {isEditing ? (
          <>
            <label className="flex flex-col gap-1">
              Favourite Momo:
              <select
                value={favouriteDraft}
                onChange={(e) => setFavouriteDraft(e.target.value)}
                className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text)]"
              >
                <option value="">Choose a species...</option>
                {speciesList?.map((species) => (
                  <option key={species.id} value={species.name}>
                    {species.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1">
              Currently Seeking:
              <select
                value={seekingDraft}
                onChange={(e) => setSeekingDraft(e.target.value)}
                className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 text-[var(--color-text)]"
              >
                <option value="">Choose a species...</option>
                {speciesList?.map((species) => (
                  <option key={species.id} value={species.name}>
                    {species.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="mt-2 self-start rounded-lg bg-[var(--color-green-tint)] px-4 py-1.5 font-bold text-[var(--color-dark)] disabled:opacity-50"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <>
            <p>Favourite Momo: {user?.favourite_species || '—'}</p>
            <p>Currently Seeking: {user?.currently_seeking || '—'}</p>
          </>
        )}

        <p>
          Last capture:{' '}
          {lastCapture
            ? `${formatDate(lastCapture.created_at)} in ${lastCapture.location ?? 'an unknown location'}`
            : '—'}
        </p>
      </div>

      {battleStats && (
        <div className="mt-5">
          <BattleStatsCard stats={battleStats} />
        </div>
      )}
    </div>
  )
}
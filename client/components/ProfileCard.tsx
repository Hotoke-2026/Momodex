import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllSpecies } from '../apis/species'
import { updateProfileFields } from '../apis/users'
import { ProfileAvatar } from './ProfileAvatar'
import { BattleStatsCard } from './BattleStatsCard'
import type { User, BattleStats, LastCapture } from '../../models/types'
import { useAuth0 } from '@auth0/auth0-react'
import { Edit2, X } from 'lucide-react'

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

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getDisplayName(name?: string | null) {
  if (!name) return name
  return EMAIL_PATTERN.test(name) ? name.split('@')[0] : name
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
    <div
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-white/20 text-white"
      style={{
        background: `
          radial-gradient(ellipse 80% 60% at 70% 85%, rgba(167, 243, 208, 0.22) 0%, transparent 70%),
          radial-gradient(ellipse 70% 50% at 10% 50%, rgba(110, 231, 183, 0.18) 0%, transparent 75%),
          radial-gradient(ellipse 65% 55% at 60% 15%, rgba(167, 243, 208, 0.2) 0%, transparent 70%),
          linear-gradient(160deg, #1f5233 0%, #2f6b45 45%, #3d7d52 75%, #2a5f3c 100%)
        `,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />


      {/* Edit Button */}
      <button
        type="button"
        onClick={() => (isEditing ? setIsEditing(false) : startEditing())}
        aria-label={isEditing ? 'Cancel editing profile' : 'Edit profile'}
        className="group absolute right-4 top-4 sm:right-6 sm:top-6 flex h-11 w-11 items-center justify-center rounded-full bg-black/25 backdrop-blur-md border border-white/30 text-white shadow-md hover:bg-white hover:text-emerald-800 hover:border-white hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 cursor-pointer z-20"
      >
        {isEditing ? (
          <X className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90" />
        ) : (
          <Edit2 className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
        )}
      </button>

      <div className="flex items-start gap-4 pr-14 relative z-10">
        <ProfileAvatar name={user?.name} avatarUrl={user?.avatar_url} size={72} />
        <p className="mt-4 text-[length:var(--text-body-md)] italic text-white font-medium">
          Momo Collecting since {formatDate(user?.created_at) ?? '—'}
        </p>
      </div>

      <h1 className="mt-4 max-w-full truncate font-display text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-sm relative z-10">
        {getDisplayName(user?.name) ?? 'Loading...'}
      </h1>

      <div className="mt-4 flex flex-col gap-2 text-[length:var(--text-body-md)] text-emerald-50 font-medium relative z-10">
        {isEditing ? (
          <>
            <label className="flex flex-col gap-1">
              Favourite Momo:
              <select
                value={favouriteDraft}
                onChange={(e) => setFavouriteDraft(e.target.value)}
                className="rounded-xl border border-white/30 bg-black/30 backdrop-blur-md px-3.5 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="" className="bg-emerald-900 text-white">
                  Choose a species...
                </option>
                {speciesList?.map((species) => (
                  <option key={species.id} value={species.name} className="bg-emerald-900 text-white">
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
                className="rounded-xl border border-white/30 bg-black/30 backdrop-blur-md px-3.5 py-2 text-white"
              >
                <option value="" className="bg-emerald-900 text-white">
                  Choose a species...
                </option>
                {speciesList?.map((species) => (
                  <option key={species.id} value={species.name} className="bg-emerald-900 text-white">
                    {species.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="mt-2 self-start rounded-xl bg-white px-5 py-2 font-bold text-emerald-800 shadow-md hover:bg-emerald-50 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <>
            <p>
              <span className="text-white font-semibold">Favourite Momo:</span>{' '}
              {user?.favourite_species || '—'}
            </p>
            <p>
              <span className="text-white font-semibold">Currently Seeking:</span>{' '}
              {user?.currently_seeking || '—'}
            </p>
          </>
        )}

        <p>
          <span className="text-white font-semibold">Last capture:</span>{' '}
          {lastCapture
            ? `${formatDate(lastCapture.created_at)} in ${lastCapture.location ?? 'an unknown location'}`
            : '—'}
        </p>
      </div>

      {battleStats && (
        <div className="mt-5 border-t border-white/20 pt-5 relative z-10">
          <BattleStatsCard stats={battleStats} />
        </div>
      )}
    </div>
  )
}
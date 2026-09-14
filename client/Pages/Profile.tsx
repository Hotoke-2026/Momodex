import { useQuery } from '@tanstack/react-query'
import { NavBar } from '../components/NavBar'
import { ProfileAvatar } from '../components/ProfileAvatar'
import { BattleStatsCard } from '../components/BattleStatsCard'
import { FavouriteSpeciesCard } from '../components/FavouriteSpeciesCard'
import { BadgeGallery } from '../components/BadgeGallery'
import { getUserById } from '../apis/users'
import { useBattleStats } from '../hooks/useBattleStats'
import '../styles/index.css'

const CURRENT_USER_ID = 'user1'

export function Profile() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user', CURRENT_USER_ID],
    queryFn: () => getUserById(CURRENT_USER_ID),
  })
  const { data: battleStats, isLoading: statsLoading } = useBattleStats(CURRENT_USER_ID)
  const favouriteSpecies = (user as { favourite_species?: string | null | undefined } | undefined)
    ?.favourite_species

  return (
    <div className="min-h-screen">
      <NavBar />

      <header className="app-header flex items-center gap-4">
        <ProfileAvatar name={user?.name} avatarUrl={user?.avatar_url} />
        <div>
          <h1 className="font-display text-(length:--text-heading-md) font-black text-(--color-text)">
            {userLoading ? 'Loading...' : user?.name}
          </h1>
          <p className="text-(length:--text-body-md) text-(--color-text-soft)">Trainer Profile</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pb-12">
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {statsLoading ? (
            <p className="text-(--color-text-soft)">Loading battle stats...</p>
          ) : (
            battleStats && <BattleStatsCard stats={battleStats} />
          )}

          {userLoading ? (
            <p className="text-(--color-text-soft)">Loading favourite species...</p>
          ) : (
            <FavouriteSpeciesCard userId={CURRENT_USER_ID} favouriteSpecies={favouriteSpecies} />
          )}
        </div>

        <main className="mt-8">
          <h2 className="mb-3 font-display text-(length:--text-heading-sm) font-(--font-weight-heading-bold) text-(--color-text)">
            Achievements
          </h2>
          <BadgeGallery userId={CURRENT_USER_ID} />
        </main>
      </div>
    </div>
  )
}
import { useQuery } from '@tanstack/react-query'
import { NavBar } from '../components/NavBar'
import { ProfileCard } from '../components/ProfileCard'
import { AchievementCompletionBar } from '../components/AchievementCompletionBar'
import { BadgeGallery } from '../components/BadgeGallery'
import { getUserById } from '../apis/users'
import { useBattleStats } from '../hooks/useBattleStats'
import { useLastCapture } from '../hooks/useLastCapture.ts'
import { useAchievements } from '../hooks/useAchievements'
import '../styles/index.css'
import { Footer } from '../components/Footer.tsx'
import { useAuth0 } from '@auth0/auth0-react'

export function Profile() {
  const { user: auth0User, isAuthenticated, isLoading: isAuthLoading, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const userId = auth0User?.sub

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      getUserById(userId!, getAccessTokenSilently, {
        name: auth0User?.name,
        picture: auth0User?.picture,
      }),
    enabled: isAuthenticated && !!userId,
  })
  
  const { data: battleStats } = useBattleStats(userId ?? '')
  const { data: lastCapture } = useLastCapture(userId ?? '')
  const { data: achievements } = useAchievements(userId ?? '')

  const unlockedCount = achievements?.filter((a) => a.unlocked).length ?? 0
  const totalCount = achievements?.length ?? 0

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-base)]">
        <NavBar />
        <p className="p-6 text-[var(--color-text-soft)]">Loading session...</p>
      </div>
    )
  }

  if (!isAuthenticated || !userId) {
    return (
      <div className="min-h-screen bg-[var(--color-base)]">
        <NavBar />
        <div className="p-6 text-center">
          <p className="text-[var(--color-text-soft)]">Please log in to view your profile.</p>
          <button
            onClick={() => loginWithRedirect({ appState: { targetUrl: window.location.pathname } })}
            className="mt-2 text-sm font-medium text-[var(--color-green)] hover:underline"
          >
            Log in now
          </button>
        </div>
      </div>
    )
  }

  return (
    <><div className="min-h-screen bg-[var(--color-base)]">
      <NavBar />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-4">
          <ProfileCard
            userId={userId}
            user={user}
            battleStats={battleStats}
            lastCapture={lastCapture} />
          <AchievementCompletionBar unlockedCount={unlockedCount} totalCount={totalCount} />
        </div>

        <main>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--text-heading-md)] font-black text-[var(--color-text)]">
            Achievements
          </h2>
          <BadgeGallery userId={userId} />
        </main>
      </div>
    </div><Footer /></>
  )
}
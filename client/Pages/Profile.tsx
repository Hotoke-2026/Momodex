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
import { useAuth0 } from '@auth0/auth0-react'

const CURRENT_USER_ID = 'user1'

export function Profile() {
  const { getAccessTokenSilently } = useAuth0()

  const { data: user } = useQuery({
    queryKey: ['user', CURRENT_USER_ID],
    queryFn: () => getUserById(CURRENT_USER_ID, getAccessTokenSilently),
  })
  
  const { data: battleStats } = useBattleStats(CURRENT_USER_ID)
  const { data: lastCapture } = useLastCapture(CURRENT_USER_ID)
  const { data: achievements } = useAchievements(CURRENT_USER_ID)

  const unlockedCount = achievements?.filter((a) => a.unlocked).length ?? 0
  const totalCount = achievements?.length ?? 0

  return (
    <div className="min-h-screen bg-[var(--color-base)]">
      <NavBar />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[360px_1fr]">
        <div className="flex flex-col gap-4">
          <ProfileCard
            userId={CURRENT_USER_ID}
            user={user}
            battleStats={battleStats}
            lastCapture={lastCapture}
          />
          <AchievementCompletionBar unlockedCount={unlockedCount} totalCount={totalCount} />
        </div>

        <main>
          <h2 className="mb-4 font-[family-name:var(--font-display)] text-[length:var(--text-heading-md)] font-black text-[var(--color-text)]">
            Achievements
          </h2>
          <BadgeGallery userId={CURRENT_USER_ID} />
        </main>
      </div>
    </div>
  )
}
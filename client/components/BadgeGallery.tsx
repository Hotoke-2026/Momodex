import type { AchievementWithStatus } from '../../models/types'
import { useAchievements } from '../hooks/useAchievements'
import '../styles/index.scss'
import { AchievementBadge } from './AchievementBadge'

export interface BadgeGalleryProps {
  userId: string
  previewAchievements?: AchievementWithStatus[]
}

export function BadgeGallery({
  userId,
  previewAchievements,
}: BadgeGalleryProps) {
  const {
    data: achievements,
    isLoading,
    isError,
    error,
  } = useAchievements(userId, previewAchievements)

  if (isLoading) {
    return <p className="text-[var(--color-text-soft)]">Loading badges...</p>
  }
  if (isError) {
    return <p className="text-[var(--color-red)]">{error.message}</p>
  }
  if (!achievements || achievements.length === 0) {
    return (
      <p className="text-[var(--color-text-soft)]">
        No achievements available yet!
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <AchievementBadge key={achievement.type} achievement={achievement} />
      ))}
    </div>
  )
}
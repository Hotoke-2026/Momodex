import { useAchievements } from '../hooks/useAchievements'
import '../styles/index.scss'

export interface BadgeGalleryProps {
  userId: string
}

const BADGE_ICONS: Record<string, string> = {
  first_find: '🔍',
  starter_bird: '🐦',
  starter_insect: '🐛',
  starter_plant: '🌿',
  ten_observations: '🔟',
  first_legendary: '🌟',
  first_win: '🏆',
  first_invasive_defeated: '🛡️',
}

export function BadgeGallery({ userId }: BadgeGalleryProps) {
  const {
    data: achievements,
    isLoading,
    isError,
    error,
  } = useAchievements(userId)

  if (isLoading) {
    return <p>Loading badges...</p>
  }
  if (isError) {
    return <p className="text-red-600">{error.message}</p>
  }
  if (!achievements || achievements.length === 0) {
    return <p>No achievements available yet!</p>
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {achievements.map((achievement) => (
        <div
          key={achievement.type}
          className={`achievement-card ${
            achievement.unlocked
              ? 'achievement-card--unlocked'
              : 'achievement-card--locked'
          }`}
        >
          <h3 className="achievement-card__name">{achievement.name}</h3>
          <p className="achievement-card__desc">{achievement.description}</p>
          {achievement.unlocked ? (
            <span className="achievement-card__status">
              Unlocked{' '}
              {achievement.unlocked_at &&
                new Date(achievement.unlocked_at).toLocaleDateString()}
            </span>
          ) : (
            <span className="achievement-card__status achievement-card__status--locked">
              Locked
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
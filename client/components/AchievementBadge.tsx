import type { AchievementWithStatus } from '../../models/types'

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

interface AchievementBadgeProps {
  achievement: AchievementWithStatus
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  return (
    <div
      key={achievement.type}
      className={`achievement-card ${
        achievement.unlocked
          ? 'achievement-card--unlocked'
          : 'achievement-card--locked'
      }`}
    >
      <div className="achievement-card__icon" aria-hidden="true">
        {BADGE_ICONS[achievement.type] ?? '🎖️'}
      </div>
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
  )
}

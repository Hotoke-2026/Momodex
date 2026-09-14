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
  const unlocked = achievement.unlocked

  return (
    <div
      className={`flex flex-col items-center rounded-2xl border px-5 pb-5 pt-6 text-center transition-colors ${
        unlocked
          ? 'border-[var(--color-green)] bg-[var(--color-green-tint)]'
          : 'border-[var(--color-tan)] bg-[var(--color-surface)] opacity-60'
      }`}
    >
      <div
        aria-hidden="true"
        className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full text-2xl ${
          unlocked ? 'bg-[var(--color-green)]' : 'bg-[var(--color-tan)]'
        }`}
      >
        <span className={unlocked ? '' : 'opacity-70 grayscale'}>
          {BADGE_ICONS[achievement.type] ?? '🎖️'}
        </span>
      </div>

      <h3 className="mb-1 font-[family-name:var(--font-display)] text-[length:var(--text-heading-sm)] font-[var(--font-weight-heading-bold)] text-[var(--color-text)]">
        {achievement.name}
      </h3>

      <p className="mb-3 text-[length:var(--text-body-xsm)] leading-snug text-[var(--color-text-soft)]">
        {achievement.description}
      </p>

      {unlocked ? (
        <span className="text-[length:var(--text-body-xsm)] font-[var(--font-weight-body-bold)] text-[var(--color-green)]">
          Unlocked{' '}
          {achievement.unlocked_at &&
            new Date(achievement.unlocked_at).toLocaleDateString()}
        </span>
      ) : (
        <span className="text-[length:var(--text-body-xsm)] font-[var(--font-weight-body-bold)] text-[var(--color-text-soft)] opacity-70">
          Locked
        </span>
      )}
    </div>
  )
}
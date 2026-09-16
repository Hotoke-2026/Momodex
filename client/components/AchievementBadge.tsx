import type { AchievementWithStatus } from '../../models/types'

const BADGE_ICONS: Record<string, string> = {
  first_find: '/Images/achievements/first_find.png',
  starter_bird: '/Images/achievements/starter_bird.png',
  starter_insect: '/Images/achievements/starter_insect.png',
  starter_plant: '/Images/achievements/starter_plant.png',
  ten_observations: '/Images/achievements/ten_observations.png',
  first_legendary: '/Images/achievements/first_legendary.png',
  first_win: '/Images/achievements/first_win.png',
  first_invasive_defeated: '/Images/achievements/first_invasive_defeated.png',
}

interface AchievementBadgeProps {
  achievement: AchievementWithStatus
}

export function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const unlocked = achievement.unlocked
  const icon = BADGE_ICONS[achievement.type] ?? '/Images/achievements/default.png'

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
        className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-transparent"
      >
        <img
          src={icon}
          alt={achievement.name}
          className={`h-full w-full object-cover ${
            unlocked ? '' : 'opacity-40 grayscale saturate-0'
          }`}
        />
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
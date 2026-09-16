interface AchievementCompletionBarProps {
  unlockedCount: number
  totalCount: number
}

export function AchievementCompletionBar({
  unlockedCount,
  totalCount,
}: AchievementCompletionBarProps) {
  const percent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div className="rounded-2xl border border-[var(--color-tan)] bg-[var(--color-surface)] p-5 drop-shadow-md">
      <h3 className="mb-3 font-[family-name:var(--font-display)] text-[length:var(--text-body-lg)] font-[var(--font-weight-heading-bold)] text-[var(--color-text)]">
        Achievement Completion
      </h3>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--color-tan)]"
        role="progressbar"
        aria-valuenow={unlockedCount}
        aria-valuemin={0}
        aria-valuemax={totalCount}
        aria-label="Achievements unlocked"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-800 to-green-800 transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[length:var(--text-body-xsm)] text-[var(--color-text-soft)]">
        {unlockedCount} / {totalCount} unlocked
      </p>
    </div>
  )
}
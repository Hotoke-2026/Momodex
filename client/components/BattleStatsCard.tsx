import type { BattleStats } from '../../models/types'

interface BattleStatsCardProps {
  stats: BattleStats
}

// Built as a list of { label, value } pairs rather than two hardcoded
// fields, so additional stats (win streak, total battles, etc.) can be
// added later just by adding another entry here.
export function BattleStatsCard({ stats }: BattleStatsCardProps) {
  const totalBattles = stats.wins + stats.losses
  const winRate = totalBattles > 0 ? Math.round((stats.wins / totalBattles) * 100) : 0

  const rows: { label: string; value: string | number }[] = [
    { label: 'Wins', value: stats.wins },
    { label: 'Losses', value: stats.losses },
    { label: 'Win rate', value: `${winRate}%` },
  ]

  return (
    <div className="rounded-2xl bg-[var(--color-surface)] p-4">
      <h3 className="mb-2 font-[family-name:var(--font-display)] text-[length:var(--text-body-lg)] font-[var(--font-weight-heading-bold)] text-[var(--color-text)]">
        Battle Stats
      </h3>
      <dl className="grid grid-cols-3 gap-2 text-center">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <dd className="font-[family-name:var(--font-display)] text-[length:var(--text-heading-sm)] font-[var(--font-weight-heading-bold)] text-[var(--color-green)]">
              {value}
            </dd>
            <dt className="text-[length:var(--text-body-xsm)] text-[var(--color-text-soft)]">
              {label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
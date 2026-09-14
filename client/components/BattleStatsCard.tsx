import type { BattleStats } from '../../models/types'

interface BattleStatsCardProps {
  stats: BattleStats
}

export function BattleStatsCard({ stats }: BattleStatsCardProps) {
  const totalBattles = stats.wins + stats.losses
  const winRate = totalBattles > 0 ? Math.round((stats.wins / totalBattles) * 100) : 0

  const rows: { label: string; value: string | number }[] = [
    { label: 'Wins', value: stats.wins },
    { label: 'Losses', value: stats.losses },
    { label: 'Win rate', value: `${winRate}%` },
  ]

  return (
    <div className="rounded-2xl border border-(--color-tan) bg-(--color-surface) p-5">
      <h3 className="mb-3 font-display text-(length:--text-heading-sm) font-(--font-weight-heading-bold) text-(--color-text)">
        Battle Stats
      </h3>
      <dl className="grid grid-cols-3 gap-3 text-center">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <dd className="font-display text-(length:--text-heading-md) font-(--font-weight-heading-bold) text-(--color-green)">
              {value}
            </dd>
            <dt className="text-(length:--text-body-xsm) text-(--color-text-soft)">{label}</dt>
          </div>
        ))}
      </dl>
    </div>
  )
}
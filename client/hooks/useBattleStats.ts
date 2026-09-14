import { useQuery } from '@tanstack/react-query'
import { getBattleStats } from '../apis/users'

export function useBattleStats(userId: string) {
  return useQuery({
    queryKey: ['battle-stats', userId],
    queryFn: () => getBattleStats(userId),
    enabled: Boolean(userId),
  })
}
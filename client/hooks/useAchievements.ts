import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { AchievementWithStatus } from '../../models/types'
import { getAchievements, checkAchievements } from '../apis/achievements'

export function useAchievements(
  userId: string,
  previewAchievements?: AchievementWithStatus[],
) {
  return useQuery({
    queryKey: ['achievements', userId],
    queryFn: () =>
      previewAchievements
        ? Promise.resolve(previewAchievements)
        : getAchievements(userId),
    enabled: Boolean(userId),
    initialData: previewAchievements,
  })
}

export function useCheckAchievements(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => checkAchievements(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements', userId] })
    },
  })
}
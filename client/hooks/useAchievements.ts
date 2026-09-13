import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAchievements, checkAchievements } from '../apis/achievements'

export function useAchievements(userId: string) {
  return useQuery({
    queryKey: ['achievements', userId],
    queryFn: () => getAchievements(userId),
    enabled: Boolean(userId),
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
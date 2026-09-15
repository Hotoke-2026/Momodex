import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import {
  getAchievements,
  checkAchievements,
  type CheckAchievementsPayload,
} from '../apis/achievements'

export function useAchievements(userId: string) {
  const { getAccessTokenSilently } = useAuth0()

  return useQuery({
    queryKey: ['achievements', userId],
    queryFn: () => getAchievements(getAccessTokenSilently),
    enabled: Boolean(userId),
  })
}

export function useCheckAchievements(userId: string) {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: (payload: CheckAchievementsPayload = {}) =>
      checkAchievements(payload, getAccessTokenSilently),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements', userId] })
    },
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { identifyPhoto } from '../apis/identify'

export function useIdentifyPhoto(userId?: string) {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()
  const resolvedUserId = userId ?? 'test'

  return useMutation({
    mutationFn: ({ file, location }: { file: File; location?: string }) =>
      identifyPhoto(file, resolvedUserId, location ?? getAccessTokenSilently, location ? getAccessTokenSilently : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', resolvedUserId] })
    },
  })
}
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { identifyPhoto } from '../apis/identify'

const CURRENT_USER_ID = 'user1'

export function useIdentifyPhoto() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: ({ file, location }: { file: File; location?: string }) =>
      identifyPhoto(file, CURRENT_USER_ID, location ?? getAccessTokenSilently, location ? getAccessTokenSilently : undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', CURRENT_USER_ID] })
    },
  })
}
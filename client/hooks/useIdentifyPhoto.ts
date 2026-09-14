// client/hooks/useIdentifyPhoto.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { identifyPhoto } from '../apis/identify'

const CURRENT_USER_ID = 'user1'

export function useIdentifyPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ file, location }: { file: File; location?: string }) =>
      identifyPhoto(file, CURRENT_USER_ID, location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', CURRENT_USER_ID] })
    },
  })
}

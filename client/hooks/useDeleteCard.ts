// client/hooks/useDeleteCard.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { deleteCard } from '../apis/cards'

export function useDeleteCard(userId: string) {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: (cardId: number) => deleteCard(cardId, getAccessTokenSilently),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards', userId] }) // userId still needed HERE, for the cache key
    },
  })
}

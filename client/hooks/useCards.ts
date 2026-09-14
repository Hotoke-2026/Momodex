import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { addCard } from '../apis/cards'
import { NewCardPayload } from '../../models/types'

export function useCreateCard() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: (newCard: NewCardPayload) => addCard(newCard, getAccessTokenSilently),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { fetchCards, addCard } from '../apis/cards'
import { NewCardPayload } from '../../models/types'

// Hook to fetch the authenticated user's cards
export function useUserCards() {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0()

  return useQuery({
    queryKey: ['cards'],
    queryFn: async () => {
      const token = await getAccessTokenSilently()
      return fetchCards(token)
    },
    enabled: isAuthenticated,
  })
}

// Hook to create a card for the authenticated user
export function useCreateCard() {
  const queryClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  return useMutation({
    mutationFn: async (newCard: NewCardPayload) => {
      const token = await getAccessTokenSilently()
      return addCard(newCard, token)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}
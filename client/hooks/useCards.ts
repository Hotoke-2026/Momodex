import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCard } from '../apis/cards'
import { NewCardPayload } from '../../models/types'

export function useCreateCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newCard: NewCardPayload) => addCard(newCard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cards'] })
    },
  })
}
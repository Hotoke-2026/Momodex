import { useQuery } from '@tanstack/react-query'
import { getLastCapture } from '../apis/users'

export function useLastCapture(userId: string) {
  return useQuery({
    queryKey: ['last-capture', userId],
    queryFn: () => getLastCapture(userId),
    enabled: Boolean(userId),
  })
}
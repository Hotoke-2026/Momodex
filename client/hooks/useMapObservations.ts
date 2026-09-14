import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getAllSpecies } from '../apis/species'
import { getObservationsForSpecies } from '../apis/iNaturalist.ts'

export function useMapObservations() {
  const { getAccessTokenSilently } = useAuth0()

  return useQuery({
    queryKey: ['map-observations'],
    queryFn: async () => {
      const species = await getAllSpecies(getAccessTokenSilently)
      const results = await Promise.all(
        species.map((s) => getObservationsForSpecies(s.name)),
      )
      return results.flat()
    },
    staleTime: 1000 * 60 * 60,
  })
}
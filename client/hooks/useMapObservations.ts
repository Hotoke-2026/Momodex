import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { getAllSpecies } from '../apis/species'
import { getObservationsForSpecies } from '../apis/iNaturalist.ts'

export function useMapObservations() {
  return useQuery({
    queryKey: ['map-observations'],
    queryFn: async () => {
      const species = await getAllSpecies()
      const results = await Promise.all(
        species.map((s) => getObservationsForSpecies(s.name)),
      )
      return results.flat()
    },
    staleTime: 1000 * 60 * 60,
  })
}
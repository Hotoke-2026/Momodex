// client/hooks/useMapObservations.ts
import { useQuery } from '@tanstack/react-query'
import { getAllSpecies } from '../apis/species'
import { getObservationsForSpecies } from '../apis/iNaturalist.ts'

export function useMapObservations() {
  return useQuery({
    queryKey: ['map-observations'],
    queryFn: async () => {
      const species = await getAllSpecies() // from the DB list of species, not the iNaturalist API
      const results = await Promise.all(
        species.map((s) => getObservationsForSpecies(s.name)),
      )
      return results.flat()
    },
    staleTime: 1000 * 60 * 60, // this data barely changes minute to minute
  })
}

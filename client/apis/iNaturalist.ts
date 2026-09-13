// iNaturalist public API
import request from 'superagent'

export interface ObservationPin {
  id: number
  species: string
  lat: number
  lng: number
  observedOn: string | null // e.g. "2026-08-13" — null if the observer didn't record a date
  qualityGrade: string // "research" | "needs_id" | "casual"
  obscured: boolean // true if the real coordinates are obscured for protection
}

interface Observation {
  id: number
  geojson?: {
    coordinates: [number, number]
  }
  observed_on_details?: {
    date?: string | null
  }
  quality_grade: string
  obscured: boolean
}

export async function getObservationsForSpecies(
  speciesName: string,
): Promise<ObservationPin[]> {
  const response = await request
    .get('https://api.inaturalist.org/v1/observations')
    .query({
      taxon_name: speciesName,
      place_id: 6803, //New Zealand
      per_page: 20, //increase this number to get more observations (must be under 200 or the API will be mad)
      geo: true,
      quality_grade: 'research', //only return confirmed sightings
      order_by: 'observed_on',
      order: 'desc',
    })

  return response.body.results
    .filter(
      (
        obs: Observation,
      ): obs is Observation & {
        geojson: { coordinates: [number, number] }
      } => Boolean(obs.geojson),
    )
    .map(
      (
        obs: Observation & {
          geojson: { coordinates: [number, number] }
        },
      ) => ({
        id: obs.id,
        species: speciesName,
        lat: obs.geojson.coordinates[1],
        lng: obs.geojson.coordinates[0],
        observedOn: obs.observed_on_details?.date ?? null,
        qualityGrade: obs.quality_grade,
        obscured: obs.obscured,
      }),
    )
}

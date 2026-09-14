import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllSpecies } from '../apis/species'
import { setFavouriteSpecies } from '../apis/users'

interface FavouriteSpeciesCardProps {
  userId: string
  favouriteSpecies?: string | null
}

export function FavouriteSpeciesCard({ userId, favouriteSpecies }: FavouriteSpeciesCardProps) {
  const [selectedName, setSelectedName] = useState('')
  const queryClient = useQueryClient()

  const { data: speciesList } = useQuery({
    queryKey: ['species-list'],
    queryFn: getAllSpecies,
  })

  const saveMutation = useMutation({
    mutationFn: (name: string) => setFavouriteSpecies(userId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] })
    },
  })

  return (
    <div className="rounded-2xl border border-(--color-tan) bg-(--color-surface) p-5">
      <h3 className="mb-3 font-display text-(length:--text-heading-sm) font-(--font-weight-heading-bold) text-(--color-text)">
        Favourite Species
      </h3>

      <p className="mb-3 text-(length:--text-body-md) text-(--color-text)">
        {favouriteSpecies ?? 'No favourite picked yet.'}
      </p>

      <div className="flex gap-2">
        <select
          value={selectedName}
          onChange={(e) => setSelectedName(e.target.value)}
          className="flex-1 rounded-lg border px-3 py-1.5 text-(length:--text-body-md)"
          style={{ borderColor: 'var(--color-tan)', backgroundColor: 'var(--color-base)' }}
        >
          <option value="">Choose a species...</option>
          {speciesList?.map((species) => (
            <option key={species.id} value={species.name}>
              {species.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => selectedName && saveMutation.mutate(selectedName)}
          disabled={!selectedName || saveMutation.isPending}
          className="rounded-lg bg-(--color-green) px-4 py-1.5 text-(length:--text-body-md) font-bold text-white disabled:opacity-50"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
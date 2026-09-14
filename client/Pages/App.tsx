// client/Pages/App.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CardFrame } from '../components/CardFrame'
import { NavBar } from '../components/NavBar'
import { useIdentifyPhoto } from '../hooks/useIdentifyPhoto'
import { getSpeciesById } from '../apis/species'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [location, setLocation] = useState('')

  const identifyMutation = useIdentifyPhoto()

  // Chained query: only runs once we actually have a card back,
  // since CardFrame needs full species stats, not just the species_id.
  const speciesQuery = useQuery({
    queryKey: ['species', identifyMutation.data?.species_id],
    queryFn: () => getSpeciesById(identifyMutation.data!.species_id),
    enabled: !!identifyMutation.data,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    identifyMutation.mutate({
      file: selectedFile,
      location: location || undefined,
    })
  }

  return (
    <div className="min-h-screen bg-(--color-base)">
      <NavBar />

      <main className="mx-auto max-w-xl px-6 py-8">
        <h1 className="font-display text-(length:--text-heading-md) font-black text-(--color-text)">
          Make a new observation
        </h1>
        <p className="mt-1 text-sm text-(--color-text-soft)">
          Upload a photo of a plant or animal to identify it and add it to your
          collection.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="rounded-md border border-(--color-tan) bg-(--color-surface) p-2 text-sm"
          />

          <input
            type="text"
            placeholder="Location (optional)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="rounded-md border border-(--color-tan) bg-(--color-surface) px-3 py-2 text-sm"
          />

          <button
            type="submit"
            disabled={!selectedFile || identifyMutation.isPending}
            className="rounded-md bg-(--color-green) px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {identifyMutation.isPending
              ? 'Identifying...'
              : 'Make a new observation'}
          </button>
        </form>

        {identifyMutation.isError && (
          <p className="mt-4 text-sm text-(--color-red)">
            {identifyMutation.error.message}
          </p>
        )}

        {identifyMutation.isSuccess && speciesQuery.data && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-(--color-green)">
              You captured a {speciesQuery.data.name}!
            </p>
            <CardFrame
              card={identifyMutation.data}
              species={speciesQuery.data}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App

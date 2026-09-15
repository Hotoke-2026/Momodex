import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { NavBar } from '../components/NavBar'
import { useIdentifyPhoto } from '../hooks/useIdentifyPhoto'
import { getSpeciesById } from '../apis/species.ts'
import { identifyPhoto } from '../apis/identify.ts'
import { CardFrame } from '../components/CardFrame.tsx'
import '../styles/index.css'

const TUI_TEST_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Tui_%28Prosthemadera_novaeseelandiae%29_Tiritiri_Matangi.jpg/250px-Tui_%28Prosthemadera_novaeseelandiae%29_Tiritiri_Matangi.jpg'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [location, setLocation] = useState('')

  const { isAuthenticated, user: auth0User, getAccessTokenSilently, loginWithRedirect } = useAuth0()
  const userId = auth0User?.sub ?? 'test'

  const identifyMutation = useIdentifyPhoto()

  const testIdentifyMutation = useMutation({
    mutationFn: () => identifyPhoto(TUI_TEST_IMAGE_URL, userId, getAccessTokenSilently),
  })

  const activeMutation = selectedFile ? identifyMutation : testIdentifyMutation

  const speciesQuery = useQuery({
    queryKey: ['species', activeMutation.data?.species_id],
    queryFn: () => getSpeciesById(activeMutation.data!.species_id),
    enabled: !!activeMutation.data?.species_id,
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
          Upload a photo of a plant or animal to identify it and add it to your collection.
        </p>

        {isAuthenticated ? (
          <>
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

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!selectedFile || identifyMutation.isPending}
                  className="rounded-md bg-(--color-green) px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {identifyMutation.isPending ? 'Identifying...' : 'Make a new observation'}
                </button>

                <button
                  type="button"
                  onClick={() => testIdentifyMutation.mutate()}
                  disabled={testIdentifyMutation.isPending || identifyMutation.isPending}
                  className="rounded-md border border-(--color-tan) bg-(--color-surface) px-4 py-2 text-sm font-semibold text-(--color-text) disabled:opacity-50"
                >
                  {testIdentifyMutation.isPending ? 'Identifying...' : 'Upload fake tui photo'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="mt-6 rounded-md border border-(--color-tan) bg-(--color-surface) p-4 text-center">
            <p className="text-sm text-(--color-text-soft)">
              Please log in to upload photos and make new observations.
            </p>
            <button
              onClick={() => loginWithRedirect({ appState: { targetUrl: window.location.pathname } })}
              className="mt-2 text-sm font-medium text-(--color-green) hover:underline"
            >
              Log in now
            </button>
          </div>
        )}

        {activeMutation.isError && (
          <p className="mt-4 text-sm text-[var(--color-red)]">
            {activeMutation.error instanceof Error ? activeMutation.error.message : 'Request failed'}
          </p>
        )}

        {activeMutation.isSuccess && speciesQuery.data && activeMutation.data && (
          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold text-[var(--color-green)]">
              You captured a {speciesQuery.data.name}!
            </p>
            <CardFrame card={activeMutation.data} species={speciesQuery.data} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
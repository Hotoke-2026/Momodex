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

  const { user: auth0User, getAccessTokenSilently } = useAuth0()
  const userId = auth0User?.sub ?? 'test'

  const identifyMutation = useIdentifyPhoto()

  const testIdentifyMutation = useMutation({
    mutationFn: () => identifyPhoto(TUI_TEST_IMAGE_URL, userId, getAccessTokenSilently),
  })

  const activeMutation = selectedFile ? identifyMutation : testIdentifyMutation

  const speciesQuery = useQuery({
    queryKey: ['species', activeMutation.data?.species_id],
    queryFn: () => getSpeciesById(activeMutation.data!.species_id, getAccessTokenSilently),
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
    <div className="app">
      <NavBar />
      <button
        onClick={() => testIdentifyMutation.mutate()}
        disabled={testIdentifyMutation.isPending || identifyMutation.isPending}
      >
        {testIdentifyMutation.isPending
          ? 'Identifying...'
          : 'upload a fake tui photo'}
      </button>

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
          <CardFrame
            card={activeMutation.data}
            species={speciesQuery.data}
          />
        </div>
      )}
    </div>
  )
}

export default App
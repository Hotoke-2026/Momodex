import { useMutation, useQuery } from '@tanstack/react-query'
import { CardFrame } from '../components/CardFrame.tsx'
import { identifyPhoto } from '../apis/identify.ts'
import { getSpeciesById } from '../apis/species.ts'
import '../styles/index.css'

const TUI_TEST_IMAGE_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Tui_%28Prosthemadera_novaeseelandiae%29_Tiritiri_Matangi.jpg/250px-Tui_%28Prosthemadera_novaeseelandiae%29_Tiritiri_Matangi.jpg'

function App() {
  //TODO: replace test image with cloudinary upload input
  const identifyMutation = useMutation({
    mutationFn: () => identifyPhoto(TUI_TEST_IMAGE_URL, 'user1'),
  })

  const speciesQuery = useQuery({
    queryKey: ['species', identifyMutation.data?.species_id],
    queryFn: () => getSpeciesById(identifyMutation.data!.species_id),
    enabled: !!identifyMutation.data, // ← the important part, explained below
  })

  return (
    <div className="app">
      <h1>Momodex!</h1>
      <button
        onClick={() => identifyMutation.mutate()}
        disabled={identifyMutation.isPending}
      >
        {identifyMutation.isPending
          ? 'Identifying...'
          : 'upload a fake tui photo'}
      </button>

      {identifyMutation.isError && (
        <p style={{ color: 'red' }}>{identifyMutation.error.message}</p>
      )}

      {speciesQuery.isLoading && identifyMutation.isSuccess && (
        <p>Loading species info...</p>
      )}

      {identifyMutation.data && speciesQuery.data && (
        <CardFrame card={identifyMutation.data} species={speciesQuery.data} />
      )}
    </div>
  )
}

export default App

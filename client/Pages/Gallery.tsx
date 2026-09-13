import { useGalleryImages } from '../hooks/use-gallery'
import { UploadForm } from '../components/UploadForm'

export function Gallery() {
  const { data: images, isLoading, isError, error } = useGalleryImages()

  if (isLoading) {
    return <p className="p-6">Loading gallery...</p>
  }
  if (isError) {
    return <p className="p-6 text-red-600">{error.message}</p>
  }

  return (
    <div className="min-h-screen">
      <header className="app-header">
        <h1>Community Gallery</h1>
      </header>

      <div className="mx-auto max-w-6xl px-4">
        <UploadForm />

        <main className="mt-6 pb-12">
          {images?.length === 0 ? (
            <p>No photos uploaded yet!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {images?.map((image) => (
                <div key={image.id} className="rounded-lg border p-2">
                  <img
                    src={image.image_url}
                    alt={image.caption ?? 'Gallery photo'}
                    className="w-full rounded"
                  />
                  {image.caption && <p className="mt-2">{image.caption}</p>}
                  <p className="mt-1 text-sm text-gray-500">
                    Uploaded by {image.user_id} on{' '}
                    {new Date(image.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

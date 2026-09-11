import { useState } from 'react'
import { validateImageFile } from '../utils/fileValidator'
import { useUploadImage } from '../hooks/use-gallery'

const CURRENT_USER_ID = 'user1'

export function UploadForm() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutate: upload, isPending } = useUploadImage()

  function handleFile(file: File | undefined) {
    if (!file) return

    const result = validateImageFile(file)

    if (!result.valid) {
      setError(result.errorMessage || 'Invalid file')
      setSelectedFile(null)
      setPreviewUrl(null)
      return
    }

    setError(null)
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile) return

    upload(
      { file: selectedFile, userId: CURRENT_USER_ID, caption },
      {
        onSuccess: () => {
          setSelectedFile(null)
          setPreviewUrl(null)
          setCaption('')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/png,image/jpeg,image/gif"
        onChange={handleInputChange}
        data-testid="file-input"
      />

      {previewUrl && (
        <img src={previewUrl} alt="preview" style={{ maxHeight: '150px' }} />
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input
        type="text"
        placeholder="Caption (optional)"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />

      {selectedFile && !error && (
        <button type="submit" disabled={isPending}>
          {isPending ? 'Uploading...' : 'Upload'}
        </button>
      )}
    </form>
  )
}

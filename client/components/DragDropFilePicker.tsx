import { useState } from 'react'
import { validateImageFile } from '../utils/fileValidator'

export default function DragDropFilePicker() {
  // what the image shows on screen
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  // the file that is selected
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  // error message if the file is invalid
  const [error, setError] = useState<string | null>(null)

  // this function handles the file validation and sets the state accordingly
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
  // this function handles the drop event and calls handleFile with the dropped file
  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }
  // this function handles the input change event and calls handleFile with the selected file
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleFile(e.target.files?.[0])
  }

  return (
    <div>
      <div
        // required — without preventDefault here, the browser won't allow a drop at all
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        style={{
          border: '2px dashed gray',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <p>Drag a photo here, or choose a file below</p>
        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={handleInputChange}
        />

        {/* display the preview image if there is one */}
        {previewUrl && (
          <img src={previewUrl} alt="preview" style={{ maxHeight: '150px' }} />
        )}
      </div>
      {/* display the error message if there is one */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {selectedFile && !error && <button>Analyze & Generate Card</button>}
    </div>
  )
}

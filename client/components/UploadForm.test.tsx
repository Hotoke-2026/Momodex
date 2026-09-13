import { render, screen, fireEvent } from '@testing-library/react'
import { it, expect } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UploadForm } from './UploadForm'

it('shows error for wrong file type', () => {
  const client = new QueryClient()
  render(
    <QueryClientProvider client={client}>
      <UploadForm />
    </QueryClientProvider>,
  )

  const fileInput = screen.getByTestId('file-input') as HTMLInputElement
  const file = new File(['dummy'], 'notes.txt', { type: 'text/plain' })

  fireEvent.change(fileInput, { target: { files: [file] } })

  expect(
    screen.getByText('Only PNG, JPG, or GIF images are supported.'),
  ).toBeInTheDocument()
})

it('shows error for oversized file', () => {
  const client = new QueryClient()
  render(
    <QueryClientProvider client={client}>
      <UploadForm />
    </QueryClientProvider>,
  )

  const fileInput = screen.getByTestId('file-input') as HTMLInputElement
  const file = new File([new Uint8Array(6 * 1024 * 1024)], 'big.jpg', {
    type: 'image/jpeg',
  })

  fireEvent.change(fileInput, { target: { files: [file] } })

  expect(screen.getByText('Image must be 5MB or smaller.')).toBeInTheDocument()
})

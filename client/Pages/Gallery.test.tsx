import { it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Gallery } from './Gallery'

vi.mock('../apis/gallery.ts', () => ({
  getGalleryImages: () =>
    Promise.resolve([
      {
        id: 1,
        user_id: 'user1',
        image_url: 'https://example.com/photo.jpg',
        caption: 'test photo',
        created_at: '2026-01-01',
      },
    ]),
}))

it('renders gallery images', async () => {
  const client = new QueryClient()
  render(
    <QueryClientProvider client={client}>
      <Gallery />
    </QueryClientProvider>,
  )
  expect(await screen.findByText(/test photo/i)).toBeTruthy()
})

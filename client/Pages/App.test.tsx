// import { it, expect, vi } from 'vitest'
// import { render, screen } from '@testing-library/react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// import App from './App'

// vi.mock('../apis/fruits.ts', () => ({
//   getFruits: () => Promise.resolve(['banana']),
// }))

// it('renders the app heading', () => {
//   const client = new QueryClient()

//   render(
//     <QueryClientProvider client={client}>
//       <App />
//     </QueryClientProvider>,
//   )

//   expect(screen.getByText(/Fullstack Boilerplate/i)).toBeTruthy()
// })

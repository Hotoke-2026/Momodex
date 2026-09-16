import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { Auth0Provider } from '@auth0/auth0-react'

import routes from './routes.tsx'
import { AchievementToastContainer } from './components/AchievementToast'

const queryClient = new QueryClient()
const router = createBrowserRouter(routes)

const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience =
  import.meta.env.VITE_AUTH0_AUDIENCE || 'https://api.momodex.com'

document.addEventListener('DOMContentLoaded', () => {
  createRoot(document.getElementById('app') as HTMLElement).render(
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={(appState) => {
        const target = appState?.targetUrl || window.location.pathname
        window.history.replaceState({}, document.title, target)
      }}
    >
      <QueryClientProvider client={queryClient}>
        <AchievementToastContainer />
        <RouterProvider router={router} />
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </Auth0Provider>,
  )
})

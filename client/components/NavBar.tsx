// NavBar for all pages, with links to Home, Deck, Battle, and Map
import { NavLink } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../apis/users'
import { useAuth0 } from '@auth0/auth0-react'

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/deck', label: 'Card Deck', icon: '🎴' },
  { to: '/battle', label: 'Battle', icon: '⚔️' },
  { to: '/map', label: 'Map', icon: '📍' },
]

export function NavBar() {
  const { isAuthenticated, user: auth0User, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0()

  const userId = auth0User?.sub

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!, getAccessTokenSilently),
    enabled: isAuthenticated && !!userId,
  })

  return (
    <nav className="flex items-center justify-between border-b border-(--color-tan) bg-(--color-surface) px-6 py-3">
      <span className="font-(--font-display) font-(--font-weight-heading-bold) text-lg text-(--color-text)">
        Momodex
      </span>

      <div className="flex gap-2">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-(--color-green-tint) text-(--color-green)'
                  : 'text-(--color-text-soft) hover:bg-(--color-base)'
              }`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {isAuthenticated ? (
          <>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--color-green) text-xs font-bold text-white overflow-hidden">
              {auth0User?.picture ? (
                <img src={auth0User.picture} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                user?.name?.[0] ?? auth0User?.name?.[0] ?? '?'
              )}
            </div>
            <span className="text-sm font-medium text-(--color-text)">
              {user?.name ?? auth0User?.name ?? 'Loading...'}
            </span>
            <button 
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="text-sm font-medium text-(--color-red) hover:underline"
            >
              Log out
            </button>
          </>
        ) : (
          <button 
            onClick={() => loginWithRedirect({
              appState: { targetUrl: window.location.pathname }
            })}
            className="text-sm font-medium text-(--color-green) hover:underline"
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  )
}
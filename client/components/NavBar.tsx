// NavBar for all pages, with links to Home, Deck, Battle, and Map
import { NavLink } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../apis/users'
import { useAuth0 } from '@auth0/auth0-react'
import { Home, Layers, Swords, MapPin } from 'lucide-react'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/deck', label: 'Card Deck', icon: Layers },
  { to: '/battle', label: 'Battle', icon: Swords },
  { to: '/map', label: 'Map', icon: MapPin },
]

export function NavBar() {
  const {
    isAuthenticated,
    user: auth0User,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0()

  const userId = auth0User?.sub

  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      getUserById(userId!, getAccessTokenSilently, {
        name: auth0User?.name,
        picture: auth0User?.picture,
      }),
    enabled: isAuthenticated && !!userId,
  })

  return (
    <nav className="relative flex items-center justify-between border-b border-(--color-tan) bg-(--color-surface) px-6 py-3">
      {/* Brand Logo / Name */}
      <span className="font-(--font-weight-heading-bold) text-lg text-(--color-text) z-10">
        Momodex
      </span>

      {/* Centered Navigation Links */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-1 sm:gap-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-(--color-green-tint) text-(--color-green)'
                  : 'text-(--color-text-soft) hover:bg-(--color-base) hover:text-(--color-green)'
              }`
            }
          >
            <Icon className="w-4 h-4 transition-colors" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      {/* Profile & Auth Actions */}
      <div className="flex items-center gap-3 z-10 ml-auto">
        {isAuthenticated && (
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors max-w-[200px] ${
                isActive
                  ? 'bg-(--color-green-tint) text-(--color-green)'
                  : 'text-(--color-text) hover:bg-(--color-base) hover:text-(--color-green)'
              }`
            }
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-(--color-green) text-xs font-bold text-white overflow-hidden">
              {auth0User?.picture ? (
                <img
                  src={auth0User.picture}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                (user?.name?.[0] ?? auth0User?.name?.[0] ?? '?')
              )}
            </div>
            <span className="text-sm font-medium truncate transition-colors">
              {user?.name ?? auth0User?.name}
            </span>
          </NavLink>
        )}

        {isAuthenticated ? (
          <button
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            className="rounded-lg border border-(--color-red)/30 bg-(--color-red-tint,rgba(239,68,68,0.1)) px-3.5 py-1.5 text-sm font-semibold text-(--color-red) shadow-xs hover:bg-(--color-red) hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Log out
          </button>
        ) : (
          <button
            onClick={() =>
              loginWithRedirect({
                appState: { targetUrl: window.location.pathname },
              })
            }
            className="rounded-lg bg-(--color-green) px-4 py-1.5 text-sm font-semibold text-white shadow-xs hover:brightness-110 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  )
}
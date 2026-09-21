
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getUserById } from '../apis/users'
import { useAuth0 } from '@auth0/auth0-react'
import { Home, Layers, Swords, MapPin, Menu, X } from 'lucide-react'
import { ProfileAvatar } from './ProfileAvatar'

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/deck', label: 'Card Deck', icon: Layers },
  { to: '/battle', label: 'Battle', icon: Swords },
  { to: '/map', label: 'Map', icon: MapPin },
]

export function NavBar() {
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const closeMenu = () => setMenuOpen(false)

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const displayName = user?.name ?? auth0User?.name

  const handleLogout = () => {
    closeMenu()
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  const handleLogin = () => {
    closeMenu()
    loginWithRedirect({ appState: { targetUrl: window.location.pathname } })
  }

  const profileLink = (className = '') => (
    <NavLink
      to="/profile"
      onClick={closeMenu}
      className={({ isActive }) =>
        `flex items-center gap-2.5 rounded-md px-2 py-1 transition-colors ${className} ${
          isActive
            ? 'bg-(--color-green-tint) text-(--color-green)'
            : 'text-(--color-text) hover:bg-(--color-base) hover:text-(--color-green)'
        }`
      }
    >
      <ProfileAvatar
        name={displayName}
        avatarUrl={user?.avatar_url ?? auth0User?.picture}
        size={28}
      />
      <span className="text-sm font-medium truncate transition-colors">
        {displayName}
      </span>
    </NavLink>
  )

  const authButton = (className = '') =>
    isAuthenticated ? (
      <button
        onClick={handleLogout}
        className={`rounded-lg border border-(--color-red)/30 bg-(--color-red-tint,rgba(239,68,68,0.1)) px-3.5 py-1.5 text-sm font-semibold text-(--color-red) shadow-xs hover:bg-(--color-red) hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 ${className}`}
      >
        Log out
      </button>
    ) : (
      <button
        onClick={handleLogin}
        className={`rounded-lg bg-(--color-green) px-4 py-1.5 text-sm font-semibold text-white shadow-xs hover:brightness-110 transition-all active:scale-95 cursor-pointer shrink-0 ${className}`}
      >
        Log in
      </button>
    )

  return (
    <nav className="relative border-b border-(--color-tan) bg-(--color-surface)">
      <div className="relative flex items-center justify-between overflow-hidden px-4 py-3 sm:px-6">
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-1/2 z-20 hidden -translate-y-1/2 transition-all duration-2000 ease-out lg:block ${
            isLogoHovered
              ? 'left-[calc(100%-2.5rem)] opacity-100 scale-100'
              : 'left-2 opacity-0 scale-50'
          }`}
        >
          <img src="/Images/jimbo.png" alt="" className="h-6 w-6" />
        </div>

        {/* Brand Logo / Name with hover handlers */}
        <div
          onMouseEnter={() => setIsLogoHovered(true)}
          onMouseLeave={() => setIsLogoHovered(false)}
          className="z-10 cursor-pointer"
        >
          <span className="font-(--font-weight-heading-bold) text-lg text-(--color-text) transition-colors hover:text-(--color-green)">
            Momodex
          </span>
        </div>

        {/* Centered Navigation Links (desktop) */}
        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-2 lg:flex">
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
              <Icon className="h-4 w-4 transition-colors" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* Profile & Auth Actions (desktop) */}
        <div className="z-10 ml-auto hidden items-center gap-3 lg:flex">
          {isAuthenticated && profileLink('max-w-[200px]')}
          {authButton()}
        </div>

        {/* Hamburger (mobile / tablet) */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          className="z-10 -mr-2 ml-auto flex h-9 w-9 cursor-pointer items-center justify-center rounded-md text-(--color-text) transition-colors hover:bg-(--color-base) hover:text-(--color-green) lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute left-0 right-0 top-full z-50 border-b border-(--color-tan) bg-(--color-surface) px-4 pb-4 pt-2 shadow-md sm:px-6 lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-(--color-green-tint) text-(--color-green)'
                      : 'text-(--color-text-soft) hover:bg-(--color-base) hover:text-(--color-green)'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-(--color-tan) pt-3">
            {isAuthenticated && profileLink('py-2')}
            {authButton('w-full py-2')}
          </div>
        </div>
      )}
    </nav>
  )
}
import { NavLink } from 'react-router'

const links = [
  { to: '/', label: 'Home' },
  { to: '/deck', label: 'Card Deck' },
  { to: '/battle', label: 'Battle' },
  { to: '/map', label: 'Map' },
  { to: '/profile', label: 'Profile' },
]

export function Footer() {
  return (
    <footer className="w-full bg-(--color-surface) border-t border-(--color-tan)/40 pt-12 pb-8 px-6 sm:px-8 mt-auto text-(--color-text)">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-(--color-tan)/30">
          
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-(--color-text)">
              <span>Momodex</span>
            </div>
            <p className="text-xs text-(--color-text-soft) max-w-sm leading-relaxed">
              Empowering local communities and citizen scientists to observe, document, and preserve New Zealand’s native species and unique ecosystems.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-(--color-text-soft)">
              Explore
            </span>
            <ul className="flex flex-col gap-1.5 text-xs">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'text-(--color-green) font-semibold'
                          : 'text-(--color-text-soft) hover:text-(--color-text)'
                      }`
                    }
                  >
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Conservation Note */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-(--color-text-soft)">
              Kaitiakitanga
            </span>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Protecting our fauna and flora for future generations. Respect wildlife and follow local conservation guidelines while logging.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-(--color-text-soft)">
          <p>© {new Date().getFullYear()} Momodex. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--color-green-tint) text-(--color-green) font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-green) animate-pulse" />
              Keep NZ native species safe. Log responsibly.
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
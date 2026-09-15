export function Footer() {
  return (
    <footer className="w-full bg-(--color-surface) border-t border-(--color-tan)/40 pt-12 pb-8 px-6 sm:px-8 mt-auto text-(--color-text)">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-(--color-tan)/30">
          
          {/* Brand Column */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-(--color-text)">
              <div className="w-7 h-7 rounded-lg bg-(--color-green) text-white flex items-center justify-center font-black text-xs">
                NZ
              </div>
              <span>Momodex</span>
            </div>
            <p className="text-xs text-(--color-text-soft) max-w-sm leading-relaxed">
              Empowering local communities and citizen scientists to observe, document, and preserve New Zealand’s native species and unique ecosystems.
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-(--color-text-soft)">
              Explore
            </span>
            <ul className="flex flex-col gap-1.5 text-xs">
              <li>
                <a href="#observation-form" className="hover:text-(--color-green) transition-colors">
                  Log Observation
                </a>
              </li>
              <li>
                <a href="#conservation" className="hover:text-(--color-green) transition-colors">
                  Conservation Efforts
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-(--color-green) transition-colors">
                  Species Collection
                </a>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-(--color-text-soft)">
              Kaitiakitanga
            </span>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Protecting our fauna and flora for future generations. Respect wildlife and follow local conservation guidelines while logging.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-(--color-text-soft)">
          <p>© {new Date().getFullYear()} Momodex. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-(--color-green-tint) text-(--color-green) font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-(--color-green) animate-pulse" />
              Aotearoa Biodiversity Initiative
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
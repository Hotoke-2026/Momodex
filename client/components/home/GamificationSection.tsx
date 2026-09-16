// client/components/home/GamificationSection.tsx
import { SquareStack, Swords, Gamepad2 } from 'lucide-react'

export function GamificationSection() {
  return (
    <section
      id="gamification"
      className="py-16 px-6 sm:px-8 bg-(--color-surface) border-t border-(--color-tan)/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest text-(--color-green) bg-(--color-green-tint) border border-(--color-green)/20 uppercase mb-3">
            Collect & Defend
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-(--color-text) mt-1">
            Turn Observations into Battle Cards
          </h2>
          <p className="text-sm text-(--color-text-soft) mt-2 leading-relaxed">
            Gamifying conservation efforts by converting real-world wildlife
            encounters into powerful tools to protect native biodiversity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-base)/50 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
              <SquareStack className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-(--color-text)">
              Card Creation
            </h3>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Every photo of native fauna or flora you log is transformed into a
              unique collectible card populated with stats based on real species
              data.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-base)/50 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
              <Swords className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-(--color-text)">
              Invasive Pests Battle
            </h3>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Deploy your collected deck into battle arenas to fight back
              against invasive species like stoats, possums, and rats
              threatening local ecosystems.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-base)/50 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-(--color-text)">
              Gamified Impact
            </h3>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              By turning field data into interactive gameplay, everyday citizen
              science directly fuels engagement and awareness for New
              Zealand&apos;s biodiversity.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

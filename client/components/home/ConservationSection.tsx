// client/components/home/ConservationSection.tsx
import { TreePine, ShieldCheck, Users } from 'lucide-react'

export function ConservationSection() {
  return (
    <section
      id="conservation"
      className="py-16 px-6 sm:px-8 bg-(--color-base) border-t border-(--color-tan)/30"
    >
      <div className="mx-auto max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest text-(--color-green) bg-(--color-green-tint) border border-(--color-green)/20 uppercase mb-3">
            Conservation Impact
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-(--color-text) mt-1">
            Protecting Native Ecosystems
          </h2>
          <p className="text-sm text-(--color-text-soft) mt-2 leading-relaxed">
            Every data point collected helps researchers and local environmental
            groups track species health and manage habitat restoration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-surface) flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
              <TreePine className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-(--color-text)">
              Habitat Restoration
            </h3>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Mapping native plant distributions helps ecological teams
              prioritize reforestation areas and restore natural habitats
              efficiently.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-surface) flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-(--color-text)">
              Species Monitoring
            </h3>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Tracking sightings of endangered wildlife creates clear population
              density maps, helping target pest control where it is needed most.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-surface) flex flex-col gap-3">
            <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-(--color-text)">
              Community Action
            </h3>
            <p className="text-xs text-(--color-text-soft) leading-relaxed">
              Connecting local communities directly with environmental projects,
              turning outdoor enthusiasts into active caretakers of nature.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

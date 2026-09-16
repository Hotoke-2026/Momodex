// client/components/home/CallToActionSection.tsx
export function CallToActionSection() {
  return (
    <section className="relative overflow-hidden border-t border-b border-white/10 py-34 px-6 sm:px-8">
      <div className="absolute inset-0 z-0">
        <img
          src="/Images/kakapo.jpg"
          alt="Kākāpō in native sanctuary"
          className="w-full h-full object-center object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center flex flex-col items-center">
        <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          Every Log Counts for Aotearoa&apos;s Wildlife
        </h2>

        <p className="mt-3 text-sm sm:text-base text-white leading-relaxed font-medium drop-shadow-md max-w-xl">
          Critically endangered species like the flightless Kākāpō rely on
          intensive sanctuary preservation. Your observations help build broader
          awareness and protection networks for vulnerable species across New
          Zealand.
        </p>
      </div>
    </section>
  )
}

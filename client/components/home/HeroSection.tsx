// client/components/home/HeroSection.tsx
import { useEffect, useRef, useState } from 'react'

export function HeroSection() {
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    if (isHeroHovered) {
      video.currentTime = 0
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isHeroHovered])

  const scrollToForm = () => {
    document
      .getElementById('observation-form')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className="relative overflow-hidden border-b border-white/10 pt-16 pb-20 px-6 sm:px-8"
      onMouseEnter={() => setIsHeroHovered(true)}
      onMouseLeave={() => setIsHeroHovered(false)}
    >
      <div className="absolute inset-0 z-0">
        <img
          src="/Images/tui.jpg"
          alt="Tūī on Kowhai flower background"
          className={`w-full h-full object-center object-cover transition-opacity duration-500 ${
            isHeroHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <video
          ref={heroVideoRef}
          src="/Videos/hero.mp4"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-center object-cover transition-opacity duration-500 ${
            isHeroHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold tracking-wider uppercase mb-6 shadow-md">
          <span>Capture, Catch, Collect</span>
        </div>

        <h1 className="font-display text-(length:--text-heading-lg) sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl drop-shadow-md">
          Document the Wild World Around You
        </h1>

        <p className="mt-4 text-white sm:text-lg text-slate-200 max-w-xl leading-relaxed font-medium drop-shadow-sm">
          Snap photos of flora, fauna, insects and animals to instantly identify
          species, record field locations, and build your personal nature log.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={scrollToForm}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-(--color-green) text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Start Identifying</span>
          </button>
        </div>
      </div>
    </header>
  )
}

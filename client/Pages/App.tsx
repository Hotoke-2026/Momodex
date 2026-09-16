import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth0 } from '@auth0/auth0-react'
import { NavBar } from '../components/NavBar'
import { Footer } from '../components/Footer'
import { useIdentifyPhoto } from '../hooks/useIdentifyPhoto'
import { useCheckAchievements } from '../hooks/useAchievements'
import { getSpeciesById } from '../apis/species.ts'
import { CardFrame } from '../components/CardFrame.tsx'
import { 
  SquareStack, 
  Swords, 
  Gamepad2, 
  TreePine, 
  ShieldCheck, 
  Users 
} from 'lucide-react'
import '../styles/index.css'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  const [isHeroHovered, setIsHeroHovered] = useState(false)
  const lastAchievementCheckRef = useRef<number | null>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  const {
    isAuthenticated,
    user: auth0User,
    getAccessTokenSilently,
    loginWithRedirect,
  } = useAuth0()
  const userId = auth0User?.sub ?? 'test'

  const identifyMutation = useIdentifyPhoto(userId)
  const checkAchievementsMutation = useCheckAchievements(userId ?? '')

  // Chained query: only runs once we actually have a card back
  const speciesQuery = useQuery({
    queryKey: ['species', identifyMutation.data?.species_id],
    queryFn: () => getSpeciesById(identifyMutation.data!.species_id),
    enabled: !!identifyMutation.data,
  })

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

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    const result = await identifyMutation.mutateAsync({
      file: selectedFile,
      location: location || undefined,
    })

    const currentCardId = result?.id ?? null
    if (currentCardId && currentCardId !== lastAchievementCheckRef.current) {
      lastAchievementCheckRef.current = currentCardId
      checkAchievementsMutation.mutate({})
    }
  }

  const scrollToForm = () => {
    document
      .getElementById('observation-form')
      ?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--color-base) text-(--color-text)">
      <NavBar />

      {/* Main Content Area */}
      <div className="grow">
        {/* --- HERO SECTION --- */}
        <header
          className="relative overflow-hidden border-b border-white/10 pt-16 pb-20 px-6 sm:px-8"
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
        >
          <div className="absolute inset-0 z-0">
            <img
              src="public/Images/tui.jpg"
              alt="Tūī on Kowhai flower background"
              className={`w-full h-full object-center object-cover transition-opacity duration-500 ${
                isHeroHovered ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <video
              ref={heroVideoRef}
              src="public/Videos/hero.mp4"
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
              Snap photos of flora, fauna, insects and animals to instantly
              identify species, record field locations, and build your personal
              nature log.
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

        {/* --- CONSERVATION SECTION --- */}
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
              Every data point collected helps researchers and local environmental groups
              track species health and manage habitat restoration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Habitat Restoration */}
            <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-surface) flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
                <TreePine className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-(--color-text)">
                Habitat Restoration
              </h3>
              <p className="text-xs text-(--color-text-soft) leading-relaxed">
                Mapping native plant distributions helps ecological teams prioritize 
                reforestation areas and restore natural habitats efficiently.
              </p>
            </div>

            {/* Species Protection */}
            <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-surface) flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-(--color-text)">
                Species Monitoring
              </h3>
              <p className="text-xs text-(--color-text-soft) leading-relaxed">
                Tracking sightings of endangered wildlife creates clear population density maps,
                helping target pest control where it is needed most.
              </p>
            </div>

            {/* Community Science */}
            <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-surface) flex flex-col gap-3">
              <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-(--color-text)">
                Community Action
              </h3>
              <p className="text-xs text-(--color-text-soft) leading-relaxed">
                Connecting local communities directly with environmental projects, turning 
                outdoor enthusiasts into active caretakers of nature.
              </p>
            </div>
          </div>
        </div>
      </section>
        {/* --- FIELD OBSERVATION SECTION (FLOATING CARD DESIGN) --- */}
        <section
          id="observation-form"
          className="py-16 px-6 sm:px-8 bg-(--color-base)"
        >
          <div className="mx-auto max-w-3xl rounded-3xl bg-(--color-surface) p-8 sm:p-12 shadow-xl border border-(--color-tan)/60">
            <div className="text-center max-w-lg mx-auto mb-10">
              <span className="text-xs font-bold tracking-widest text-(--color-green) uppercase">
                Field Recording
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-(--color-text) mt-1">
                Log a New Observation
              </h2>
              <p className="text-xs sm:text-sm text-(--color-text-soft) mt-1.5">
                Follow two simple steps to analyze your photo and record your
                entry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              {/* Step 1 */}
              <div className="relative pl-10 sm:pl-12">
                <div className="absolute left-0 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-green) text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
                  1
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-(--color-text)">
                      Select Observation Photo
                    </h3>
                    <p className="text-xs text-(--color-text-soft)">
                      Upload a clear photo of the species you discovered.
                    </p>
                  </div>

                  <div className="mt-2 relative group border-2 border-dashed border-(--color-tan) hover:border-(--color-green) rounded-xl p-5 transition-colors bg-(--color-base)/40 text-center flex flex-col items-center justify-center min-h-[160px] cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileChange(e.target.files?.[0] ?? null)
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />

                    {previewUrl ? (
                      <div className="relative w-full flex flex-col items-center gap-3">
                        <img
                          src={previewUrl}
                          alt="Selected preview"
                          className="max-h-48 rounded-lg object-contain border border-(--color-tan) shadow-xs"
                        />
                        <span className="text-xs font-semibold text-(--color-green) underline underline-offset-2">
                          Click or drag to change image
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-2">
                        <div className="w-10 h-10 rounded-full bg-(--color-green-tint) flex items-center justify-center text-(--color-green)">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-(--color-text)">
                            Drop your photo here, or{' '}
                            <span className="text-(--color-green) underline">
                              browse
                            </span>
                          </p>
                          <p className="text-xs text-(--color-text-soft) mt-0.5">
                            Supports PNG, JPG, WEBP
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="ml-3.5 sm:ml-4 -my-4 w-0.5 h-6 bg-(--color-tan)/40" />

              {/* Step 2 */}
              <div className="relative pl-10 sm:pl-12">
                <div className="absolute left-0 top-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-(--color-green) text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-(--color-text)">
                      Add Location Context
                    </h3>
                    <p className="text-xs text-(--color-text-soft)">
                      Specify where you spotted this species (optional).
                    </p>
                  </div>

                  <div className="mt-2">
                    <input
                      id="location-input"
                      type="text"
                      placeholder="e.g. Waitākere Ranges, Backyard, etc."
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full rounded-xl border border-(--color-tan) bg-(--color-base)/40 px-4 py-3 text-sm text-(--color-text) placeholder:text-(--color-text-soft)/50 focus:outline-none focus:ring-2 focus:ring-(--color-green) focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 pl-10 sm:pl-12">
                <button
                  type="submit"
                  disabled={!selectedFile || identifyMutation.isPending}
                  className="w-full rounded-xl bg-(--color-green) px-6 py-3.5 text-sm font-bold text-white shadow-md hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {identifyMutation.isPending ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Identifying Observation...</span>
                    </>
                  ) : (
                    'Identify & Add to Collection'
                  )}
                </button>
              </div>
            </form>

            {identifyMutation.isError && (
              <div className="mt-6 ml-10 sm:ml-12 p-3.5 rounded-xl bg-(--color-red-tint) border border-(--color-red)/30 text-sm text-(--color-red) flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {identifyMutation.error.message ||
                    'Failed to identify photo. Please try again.'}
                </span>
              </div>
            )}

            {identifyMutation.isSuccess && speciesQuery.data && (
              <div className="mt-12 pt-10 border-t border-(--color-tan)/50 flex flex-col items-center">
                <div className="bg-(--color-green-tint) border border-(--color-green)/20 text-(--color-green) px-4 py-2 rounded-full text-sm font-semibold mb-6 flex items-center gap-2 shadow-xs">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>You captured a {speciesQuery.data.name}!</span>
                </div>

                <div className="w-full flex justify-center">
                  <CardFrame
                    card={identifyMutation.data}
                    species={speciesQuery.data}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* --- CARDS & BATTLE GAMIFICATION SECTION (FLAT LAYOUT) --- */}
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
      {/* Card Creation */}
      <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-base)/50 flex flex-col gap-3">
        <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
          <SquareStack className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-base text-(--color-text)">
          Card Creation
        </h3>
        <p className="text-xs text-(--color-text-soft) leading-relaxed">
          Every photo of native fauna or flora you log is transformed
          into a unique collectible card populated with stats based on
          real species data.
        </p>
      </div>

      {/* Invasive Pests Battle */}
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

      {/* Gamified Impact */}
      <div className="p-6 rounded-xl border border-(--color-tan)/40 bg-(--color-base)/50 flex flex-col gap-3">
        <div className="w-10 h-10 rounded-lg bg-(--color-green-tint) text-(--color-green) flex items-center justify-center font-bold">
          <Gamepad2 className="w-5 h-5" />
        </div>
        <h3 className="font-bold text-base text-(--color-text)">
          Gamified Impact
        </h3>
        <p className="text-xs text-(--color-text-soft) leading-relaxed">
          By turning field data into interactive gameplay, everyday
          citizen science directly fuels engagement and awareness for
          New Zealand&apos;s biodiversity.
        </p>
      </div>
    </div>
  </div>
</section>

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
              intensive sanctuary preservation. Your observations help build
              broader awareness and protection networks for vulnerable species
              across New Zealand.
            </p>
          </div>
        </section>
      </div>

      {/* --- FOOTER --- */}
      <Footer />
    </div>
  )
}

export default App
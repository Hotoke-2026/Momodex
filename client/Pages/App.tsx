import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CardFrame } from '../components/CardFrame'
import { NavBar } from '../components/NavBar'
import { useIdentifyPhoto } from '../hooks/useIdentifyPhoto'
import { getSpeciesById } from '../apis/species'

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [location, setLocation] = useState('')

  const identifyMutation = useIdentifyPhoto()

  // Chained query: only runs once we actually have a card back
  const speciesQuery = useQuery({
    queryKey: ['species', identifyMutation.data?.species_id],
    queryFn: () => getSpeciesById(identifyMutation.data!.species_id),
    enabled: !!identifyMutation.data,
  })

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    identifyMutation.mutate({
      file: selectedFile,
      location: location || undefined,
    })
  }

  const scrollToForm = () => {
    document.getElementById('observation-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-(--color-base) text-(--color-text) pb-20">
      <NavBar />

      {/* --- NATURE HERO SECTION WITH HIGH-CONTRAST DARK GRADIENTS --- */}
      <header className="relative overflow-hidden border-b border-white/10 pt-16 pb-20 px-6 sm:px-8">
        
        {/* Background Image Container with Dark Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1543547494-1f73a733309e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Kiwi bird in native ferns background"
            className="w-full h-full object-cover object-center scale-105"
          />
          {/* Deep dark gradient overlay for optimal legibility */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/90" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center flex flex-col items-center">
          
          {/* Nature Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-xs font-bold tracking-wider uppercase mb-6 shadow-md">
            <span>Capture, Catch, Collect</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display text-(length:--text-heading-lg) sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl drop-shadow-md">
            Document the Wild World Around You
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-white sm:text-lg text-slate-200 max-w-xl leading-relaxed font-medium drop-shadow-sm">
            Snap photos of flora, fauna, insects and animals to instantly identify species, record field locations, and build your personal nature log.
          </p>

          {/* Hero CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={scrollToForm}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-(--color-green) text-white font-bold text-sm shadow-xl hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>Start Identifying</span>
            </button>
          </div>
          </div>
      </header>

      {/* --- FORM & CONTENT SECTION --- */}
      <main className="mx-auto max-w-xl px-4 sm:px-6 pt-12">
        <div id="observation-form" className="bg-(--color-surface) rounded-2xl border border-(--color-tan) p-6 sm:p-8 shadow-sm">
          
          <div className="mb-6 pb-4 border-b border-(--color-tan)/30">
            <h2 className="font-display text-(length:--text-heading-md) font-extrabold text-(--color-text)">
              New Field Observation
            </h2>
            <p className="text-xs text-(--color-text-soft) mt-1">
              Select or drop an image below to log a new species entry.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            
            {/* Custom Image Upload Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-(--color-text-soft)">
                Observation Photo
              </label>
              
              <div className="relative group border-2 border-dashed border-(--color-tan) hover:border-(--color-green) rounded-xl p-4 transition-colors bg-(--color-base)/40 text-center flex flex-col items-center justify-center min-h-[180px] cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {previewUrl ? (
                  <div className="relative w-full flex flex-col items-center gap-3">
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="max-h-48 rounded-lg object-contain border border-(--color-tan) shadow-sm"
                    />
                    <span className="text-xs font-semibold text-(--color-green) underline underline-offset-2">
                      Click or drag to change image
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-(--color-green-tint) flex items-center justify-center text-(--color-green)">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-(--color-text)">
                        Drop your photo here, or <span className="text-(--color-green) underline">browse</span>
                      </p>
                      <p className="text-xs text-(--color-text-soft) mt-0.5">Supports PNG, JPG, WEBP</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Location Input */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="location-input" className="text-xs font-bold uppercase tracking-wider text-(--color-text-soft)">
                Location
              </label>
              <input
                id="location-input"
                type="text"
                placeholder="e.g. Waitākere Ranges, Backyard, etc."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-(--color-tan) bg-(--color-surface) px-3.5 py-2.5 text-sm text-(--color-text) placeholder:text-(--color-text-soft)/50 focus:outline-none focus:ring-2 focus:ring-(--color-green) focus:border-transparent transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!selectedFile || identifyMutation.isPending}
              className="mt-2 w-full rounded-lg bg-(--color-green) px-5 py-3 text-sm font-bold text-white shadow-sm hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {identifyMutation.isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Identifying Observation...</span>
                </>
              ) : (
                'Identify & Add to Collection'
              )}
            </button>
          </form>

          {/* Error State Banner */}
          {identifyMutation.isError && (
            <div className="mt-5 p-3.5 rounded-lg bg-(--color-red-tint) border border-(--color-red)/30 text-sm text-(--color-red) flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{identifyMutation.error.message || 'Failed to identify photo. Please try again.'}</span>
            </div>
          )}
        </div>

        {/* Observation Captured Success Section */}
        {identifyMutation.isSuccess && speciesQuery.data && (
          <div className="mt-10 pt-8 border-t border-(--color-tan)/50 flex flex-col items-center">
            <div className="bg-(--color-green-tint) border border-(--color-green)/20 text-(--color-green) px-4 py-2 rounded-full text-sm font-semibold mb-6 flex items-center gap-2 shadow-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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
      </main>
    </div>
  )
}

export default App
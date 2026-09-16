import React from 'react'
import { Trophy, Skull, RotateCcw, ArrowLeft, BookOpen } from 'lucide-react'

interface MatchResultLayoutProps {
  winner: 'player' | 'ai'
  onPlayAgain: () => void
  onReturnToDeck: () => void
  speciesFact?: string
  speciesName?: string
}

export const MatchResultLayout: React.FC<MatchResultLayoutProps> = ({
  winner,
  onPlayAgain,
  onReturnToDeck,
  speciesFact,
  speciesName,
}) => {
  const isVictory = winner === 'player'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 sm:p-6">
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border text-white ${
          isVictory
            ? 'border-emerald-400/40'
            : 'border-rose-400/40'
        }`}
        style={{
          background: isVictory
            ? `
                radial-gradient(ellipse 80% 60% at 70% 85%, rgba(167, 243, 208, 0.22) 0%, transparent 70%),
                radial-gradient(ellipse 70% 50% at 10% 50%, rgba(110, 231, 183, 0.18) 0%, transparent 75%),
                linear-gradient(160deg, #1f5233 0%, #2f6b45 45%, #3d7d52 75%, #2a5f3c 100%)
              `
            : `
                radial-gradient(ellipse 80% 60% at 70% 85%, rgba(254, 202, 202, 0.15) 0%, transparent 70%),
                radial-gradient(ellipse 70% 50% at 10% 50%, rgba(248, 113, 113, 0.15) 0%, transparent 75%),
                linear-gradient(160deg, #451a1a 0%, #6b2121 45%, #881337 75%, #4c0519 100%)
              `,
        }}
      >
        {/* Fine film-grain texture overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Ambient top light bloom */}
        <div
          className={`pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full blur-3xl ${
            isVictory ? 'bg-emerald-600/10' : 'bg-rose-300/10'
          }`}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Status Icon Badge */}
          <div
            className={`flex h-16 w-16 items-center justify-center rounded-2xl border backdrop-blur-md shadow-inner ${
              isVictory
                ? 'border-emerald-300/40 bg-emerald-400/20 text-emerald-200'
                : 'border-rose-300/40 bg-rose-400/20 text-rose-200'
            }`}
          >
            {isVictory ? (
              <Trophy className="h-8 w-8 drop-shadow-sm" />
            ) : (
              <Skull className="h-8 w-8 drop-shadow-sm" />
            )}
          </div>

          {/* Result Heading */}
          <h2 className="mt-4 font-display text-3xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
            {isVictory ? 'Victory!' : 'Defeated'}
          </h2>

          <p
            className={`mt-1 text-sm font-medium ${
              isVictory ? 'text-emerald-100' : 'text-rose-100'
            }`}
          >
            {isVictory
              ? 'Great job! You claimed victory in this match.'
              : 'Better luck next time. Don’t give up!'}
          </p>

          {/* Species Fact Note */}
          {speciesFact && (
            <div className="mt-6 w-full rounded-2xl border border-white/20 bg-black/25 backdrop-blur-md p-4 text-left shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-200">
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Field Note {speciesName ? `— ${speciesName}` : ''}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-emerald-50">
                {speciesFact}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex w-full flex-col sm:flex-row gap-3">
            <button
              onClick={onPlayAgain}
              className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 cursor-pointer shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-white ${
                isVictory
                  ? 'bg-white text-emerald-900 hover:bg-emerald-50'
                  : 'bg-white text-rose-950 hover:bg-rose-50'
              }`}
            >
              <RotateCcw className="h-4 w-4" />
              <span>Play Again</span>
            </button>

            <button
              onClick={onReturnToDeck}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/30 bg-black/25 backdrop-blur-md font-bold text-white hover:bg-white/10 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
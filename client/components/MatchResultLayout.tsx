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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-dark)]/40 backdrop-blur-sm p-4 sm:p-6">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border border-[var(--color-tan)]"
        style={{
          backgroundColor: 'var(--color-surface)',
          color: 'var(--color-text)',
        }}
      >
        {/* Subtle background ambient tint based on win/loss */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full blur-3xl opacity-60"
          style={{
            backgroundColor: isVictory
              ? 'var(--color-green-tint)'
              : 'var(--color-red-tint)',
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Status Icon Badge */}
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border shadow-sm"
            style={{
              backgroundColor: isVictory
                ? 'var(--color-green-tint)'
                : 'var(--color-red-tint)',
              borderColor: isVictory
                ? 'var(--color-green)'
                : 'var(--color-red)',
              color: isVictory ? 'var(--color-green)' : 'var(--color-red)',
            }}
          >
            {isVictory ? (
              <Trophy className="h-8 w-8 stroke-[2.5]" />
            ) : (
              <Skull className="h-8 w-8 stroke-[2.5]" />
            )}
          </div>

          {/* Result Heading */}
          <h2
            className="mt-4 font-[family-name:var(--font-display)] text-[length:var(--text-heading-lg)] font-[var(--font-weight-heading-bold)] tracking-tight"
            style={{
              color: isVictory ? 'var(--color-green)' : 'var(--color-red)',
            }}
          >
            {isVictory ? 'Victory!' : 'Defeated'}
          </h2>

          <p className="mt-1 text-[length:var(--text-body-md)] font-[var(--font-weight-body-regular)] text-[var(--color-text-soft)]">
            {isVictory
              ? 'Great job! You claimed victory in this match.'
              : 'Better luck next time. Don’t give up!'}
          </p>

          {/* Species Fact Note */}
          {speciesFact && (
            <div
              className="mt-6 w-full rounded-2xl border p-4 text-left shadow-sm"
              style={{
                backgroundColor: 'var(--color-base)',
                borderColor: 'var(--color-tan)',
              }}
            >
              <div
                className="flex items-center gap-2 text-[length:var(--text-body-xsm)] font-[var(--font-weight-body-bold)] uppercase tracking-wider"
                style={{
                  color: isVictory ? 'var(--color-green)' : 'var(--color-red)',
                }}
              >
                <BookOpen className="h-4 w-4 shrink-0" />
                <span>Field Note {speciesName ? `— ${speciesName}` : ''}</span>
              </div>
              <p className="mt-2 text-[length:var(--text-body-md)] font-[var(--font-weight-body-regular)] text-[var(--color-text)] leading-relaxed">
                {speciesFact}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex w-full flex-col sm:flex-row gap-3">
            {/* Primary Action Button */}
            <button
              onClick={onPlayAgain}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-[family-name:var(--font-display)] font-[var(--font-weight-heading-bold)] text-[length:var(--text-body-md)] text-white shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: isVictory
                  ? 'var(--color-green)'
                  : 'var(--color-red)',
              }}
            >
              <RotateCcw className="h-4 w-4 stroke-[2.5]" />
              <span>Play Again</span>
            </button>

            {/* Secondary Action Button */}
            <button
              onClick={onReturnToDeck}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border font-[family-name:var(--font-display)] font-[var(--font-weight-heading-bold)] text-[length:var(--text-body-md)] shadow-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
              style={{
                backgroundColor: 'var(--color-base)',
                borderColor: 'var(--color-tan)',
                color: 'var(--color-text)',
              }}
            >
              <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
              <span>Return to Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
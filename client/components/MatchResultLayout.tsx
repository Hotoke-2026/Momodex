import React from 'react'

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
    <div className="match-result-overlay">
      <div
        className={`match-result ${isVictory ? 'match-result--victory' : 'match-result--defeat'}`}
      >
        {/* showcases Match results */}
        <div className="match-result__icon">{isVictory ? '🌱' : '💀'}</div>

        <h2 className="match-result__heading">
          {isVictory ? 'Victory!' : 'Defeated'}
        </h2>
        <p className="match-result__subtitle">
          {isVictory ? 'Hey, you won' : 'Sorry buddy you lost'}
        </p>
        {/* showcases Facts of the species*/}
        {speciesFact && (
          <div className="match-result__fact-box">
            <p className="match-result__fact-label">
              Field Note — {speciesName}
            </p>
            <p className="match-result__fact-text">{speciesFact}</p>
          </div>
        )}
        {/* Buttons*/}
        <div className="match-result__actions">
          <button
            className="match-result-btn match-result-btn--primary"
            onClick={onPlayAgain}
          >
            Play Again
          </button>
          <button
            className="match-result-btn match-result-btn--secondary"
            onClick={onReturnToDeck}
          >
            Return to Deck
          </button>
        </div>
      </div>
    </div>
  )
}

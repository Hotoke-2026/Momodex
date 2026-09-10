import React from 'react'

interface MatchResultLayoutProps {
  winner: 'player' | 'ai'
  onPlayAgain: () => void
  onReturnToDeck: () => void
  speciesFact?: string
}

export const MatchResultLayout: React.FC<MatchResultLayoutProps> = ({
  winner,
  onPlayAgain,
  onReturnToDeck,
  speciesFact,
}) => {}

import React from 'react'
interface HpBarProps {
  currentHp: number
  maxHp: number
}

export const HpBar: React.FC<HpBarProps> = ({ currentHp, maxHp }) => {
  // Ensure the HP percentage is between 0 and 100
  const hpPercentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100))

  return (
    // HP Bar Track
    <div className="hp-bar-track">
      <div className="hp-bar-fill" style={{ width: `${hpPercentage}%` }} />
    </div>
  )
}

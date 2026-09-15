import React from 'react'
import { Card, Species } from '../../models/types'
import { HpBar } from './HpBar'
import { StatusBadge } from './StatusBadge'
import '../styles/index.scss'

export interface CardFrameProps {
  card: Card
  species: Species
  currentHp?: number
  compact?: boolean
  level?: number
}

export const CardFrame: React.FC<CardFrameProps> = ({
  card,
  species,
  currentHp = species.hp,
  compact = false,
  level = 1,
}) => {
  const isNative = species.status.toLowerCase() === 'native'

  return (
    <div className={`card-frame card-frame--level-${level}`}>
      {/* Header: Name, Rarity Badge, HP */}
      <div className="card-frame__header">
        <div className="card-frame__title-group">
          <h3 className="card-frame__name">{species.name}</h3>
        </div>
        {/* HP Bar - Updated for BATTLE!*/}
        <div className="card-frame__hp-section">
          <span className="card-frame__hp">
            HP {currentHp}/{species.hp}
          </span>
          <HpBar currentHp={currentHp} maxHp={species.hp} />
        </div>
      </div>

      {/* Card Image*/}
      {!compact && (
        <div className="card-frame__image-container">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={species.name}
              className="card-frame__image"
            />
          ) : (
            <div className="card-frame__image-placeholder">
              <span>?</span>
            </div>
          )}
        </div>
      )}

      {/* Type & Status Badges — still shown in compact mode */}
      <div className="card-frame__badges">
        <span className="badge badge--type">{species.type}</span>
        <StatusBadge isNative={isNative} label={species.status} />
        <span
          className={`card-frame__rarity card-frame__rarity--${species.rarity}`}
        >
          ☆ {species.rarity}
        </span>
      </div>

      {/* Main Move / Attack Details*/}
      {!compact && (
        <div className="card-frame__moves">
          <div className="move-item">
            <div className="move-item__header">
              <span className="move-item__name">{species.attack_name}</span>
              <span className="move-item__damage">
                Damage: {species.attack}
              </span>
            </div>
            <div className="move-item__header">
              <span className="move-item__name">{species.attack_two_name}</span>
              <span className="move-item__damage">
                Damage: {species.attack_two}
              </span>
            </div>
            <div className="move-item__header">
              <span className="move-item__name">
                Effect: {species.effect_type}
              </span>
            </div>
            <p className="move-item__desc">{species.description}</p>
          </div>
        </div>
      )}

      {/* Footer Location Info*/}
      {!compact && card.location && (
        <div className="card-frame__footer">
          <span>Observed at: {card.location}</span>
        </div>
      )}
    </div>
  )
}

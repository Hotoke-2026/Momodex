import React from 'react';
import { Card, Species } from '../../models/types';
import { StatusBadge } from './StatusBadge';
import '../styles/index.scss';

export interface CardFrameProps {
  card: Card;
  species: Species;
}

export const CardFrame: React.FC<CardFrameProps> = ({ card, species }) => {
  const isNative = species.status.toLowerCase() === 'native';

  return (
    <div className="card-frame">
      {/* Header: Name, Rarity Badge, HP */}
      <div className="card-frame__header">
        <div className="card-frame__title-group">
          <h3 className="card-frame__name">{species.name}</h3>
          <span className="card-frame__rarity">☆ {species.rarity}</span>
        </div>
        <span className="card-frame__hp">HP {species.hp}</span>
      </div>

      {/* Card Image */}
      <div className="card-frame__image-container">
        <img src={card.image_url} alt={species.name} className="card-frame__image" />
      </div>

      {/* Type & Status Badges */}
      <div className="card-frame__badges">
        <span className="badge badge--type">{species.type}</span>
        <StatusBadge isNative={isNative} label={species.status} />
      </div>

      {/* Main Move / Attack Details */}
      <div className="card-frame__moves">
        <div className="move-item">
          <div className="move-item__header">
            <span className="move-item__name">Wing Attack</span>
            <span className="move-item__damage">Attack: {species.attack}</span>
          </div>
          <p className="move-item__desc">{species.description}</p>
        </div>
      </div>

      {/* Footer Location Info */}
      {card.location && (
        <div className="card-frame__footer">
          <span>{card.location}</span>
        </div>
      )}
    </div>
  );
};
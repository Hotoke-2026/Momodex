import { CardFrame } from '../CardFrame'
import { TypeChart } from '../TypeChart'
import { getCardLevel } from '../../utils/getCardLevel'
import type { CardWithSpecies } from '../../../models/types'
import type { Species } from '../../../models/types'

interface CardSelectionScreenProps {
  cards: CardWithSpecies[]
  captureCountBySpecies: Record<string, number>
  opponentSpecies: Species | undefined
  showTypeChart: boolean
  onToggleTypeChart: () => void
  onSelectCard: (cardId: number) => void
}

export function CardSelectionScreen({
  cards,
  captureCountBySpecies,
  opponentSpecies,
  showTypeChart,
  onToggleTypeChart,
  onSelectCard,
}: CardSelectionScreenProps) {
  return (
    <div className="battle-container__selection">
      <h1 className="battle-container__selection-title">Choose your card</h1>

      {opponentSpecies ? (
        <div className="battle-container__opponent-preview">
          <p className="battle-container__opponent-preview-label">
            Your opponent:
          </p>
          <p className="battle-container__opponent-preview-name">
            {opponentSpecies.name}
            <span className="battle-container__opponent-preview-type">
              {' '}
              ({opponentSpecies.type})
            </span>
          </p>
        </div>
      ) : (
        <p className="battle-container__selection-subtitle">
          Finding an opponent...
        </p>
      )}

      <button
        className="battle-container__type-chart-toggle"
        onClick={onToggleTypeChart}
      >
        {showTypeChart ? 'Hide type chart' : 'View type chart'}
      </button>

      {showTypeChart && <TypeChart />}

      <p className="battle-container__selection-subtitle">
        Pick a species from your collection to battle with.
      </p>

      <div className="battle-container__selection-grid">
        {cards.map(({ card, species }) => (
          <button
            key={card.id}
            onClick={() => onSelectCard(card.id)}
            className="battle-container__selection-card-btn"
          >
            <CardFrame
              card={card}
              species={species}
              compact
              level={getCardLevel(captureCountBySpecies[species.id] ?? 1)}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

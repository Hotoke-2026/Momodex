// client/components/battle/BattleView.tsx
import { MatchResultLayout } from '../MatchResultLayout'
import { CardFrame } from '../CardFrame'
import { getAttackEffectClass, AttackEffectExtras } from './AttackEffects'
import { getLogEntryClass } from '../../utils/battleLogStyles'
import type { BattleState } from '../../../models/battleTypes'
import type { Card } from '../../../models/types'
import type { Dispatch } from 'react'
import type { BattleAction } from '../../Pages/BattleScreen'

interface BattleViewProps {
  state: BattleState
  dispatch: Dispatch<BattleAction>
  // ...rest unchanged
}

interface BattleViewProps {
  state: BattleState
  dispatch: Dispatch<BattleAction>
  selectedCard: Card
  onRetreat: () => void
  onReturnToDeck: () => void
  // Hit-effect state — computed in BattleScreen from the reducer's
  // explicit lastEvent list, passed down here purely for rendering.
  playerHit: boolean
  aiHit: boolean
  playerAttackerType: string | null
  aiAttackerType: string | null
}

export function BattleView({
  state,
  dispatch,
  selectedCard,
  onRetreat,
  onReturnToDeck,
  playerHit,
  aiHit,
  playerAttackerType,
  aiAttackerType,
}: BattleViewProps) {
  const isPlayerTurn = state.turn === 'player' && !state.isGameOver

  return (
    <div className="battle-container">
      <div className="battle-container__content">
        <div className="battle-container__header">
          <button className="battle-container__retreat-btn" onClick={onRetreat}>
            Retreat
          </button>
          <h1 className="battle-container__title">BATTLE</h1>
          {state.turn === 'ai' && !state.isGameOver ? (
            <span className="battle-container__status-pill">
              Opponent is thinking...
            </span>
          ) : (
            <span className="battle-container__status-text">
              {state.isGameOver ? 'Game Over' : 'Your turn — choose a move'}
            </span>
          )}
        </div>

        <div>
          <div className="battle-container__combatants-labels">
            <span>YOU</span>
            <span>OPPONENT</span>
          </div>
          <div className="battle-container__grid">
            <div
              className={`card-hit-wrapper ${
                playerHit
                  ? `hit-active ${getAttackEffectClass(playerAttackerType ?? state.ai.species.type)}`
                  : ''
              }`}
            >
              <CardFrame
                card={selectedCard}
                species={state.player.species}
                currentHp={state.player.currentHp}
                compact={true}
                level={state.player.level}
              />
              {playerHit && (
                <AttackEffectExtras
                  type={playerAttackerType ?? state.ai.species.type}
                />
              )}
            </div>

            <div
              className={`card-hit-wrapper ${
                aiHit
                  ? `hit-active ${getAttackEffectClass(aiAttackerType ?? state.player.species.type)}`
                  : ''
              }`}
            >
              <CardFrame
                card={{
                  id: 0,
                  card_name: state.ai.species.name,
                  user_id: 'ai',
                  species_id: state.ai.species.id,
                  image_url: '',
                  location: null,
                  created_at: new Date().toISOString(),
                }}
                species={state.ai.species}
                currentHp={state.ai.currentHp}
                compact={true}
                level={state.ai.level}
              />
              {aiHit && (
                <AttackEffectExtras
                  type={aiAttackerType ?? state.player.species.type}
                />
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="battle-container__moves-label">Choose a move:</p>
          <div className="battle-container__moves-grid">
            <button
              className="battle-container__move-btn"
              onClick={() => dispatch({ type: 'ATTACK' })}
              disabled={!isPlayerTurn}
            >
              <div className="move-title">
                {state.player.species.attack_name || 'Attack'}
              </div>
              <div className="move-dmg">{state.player.species.attack} DMG</div>
              <div className="move-miss-chance">
                {state.player.species.attack_miss_chance}% miss
              </div>
            </button>

            {state.player.species.attack_two != null && (
              <button
                className="battle-container__move-btn"
                onClick={() => dispatch({ type: 'ATTACK_TWO' })}
                disabled={!isPlayerTurn}
              >
                <div className="move-title">
                  {state.player.species.attack_two_name}
                </div>
                <div className="move-dmg">
                  {state.player.species.attack_two} DMG
                </div>
                <div className="move-miss-chance">
                  {state.player.species.attack_two_miss_chance}% miss
                </div>
                {state.player.species.effect_type && (
                  <div className="move-effect">
                    {state.player.species.effect_type === 'poison' &&
                      '☠️ Poison'}
                    {state.player.species.effect_type === 'lifesteal' &&
                      '💚 Lifesteal'}
                    {state.player.species.effect_type === 'swarm' &&
                      '⚡ Double Hit'}
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="battle-container__log-box">
          <h3>BATTLE LOG</h3>
          <div className="log-entries">
            {state.log.map((entry, i) => (
              <div
                key={i}
                className={`${getLogEntryClass(entry)} ${
                  i === state.log.length - 1 ? 'log-entry--new' : ''
                }`}
              >
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>

      {state.isGameOver && state.winner && (
        <MatchResultLayout
          winner={state.winner}
          onPlayAgain={() => dispatch({ type: 'RESET' })}
          onReturnToDeck={onReturnToDeck}
          speciesFact={
            state.winner === 'player'
              ? state.ai.species.fun_fact
              : state.player.species.fun_fact
          }
          speciesName={
            state.winner === 'player'
              ? state.ai.species.name
              : state.player.species.name
          }
        />
      )}
    </div>
  )
}

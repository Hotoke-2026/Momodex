import type { BattleState, BattleAction } from '../../models/battleTypes'
import { getLeveledStat } from '../utils/getLeveledStat'
import { getTypeMultiplier } from './typeChart'

const POISON_DURATION = 3

function applyPassiveDefense(
  rawDamage: number,
  defender: BattleState['player'],
) {
  const { effect_type, effect_trigger, effect_value } = defender.species

  if (effect_trigger !== 'passive' || effect_value == null) {
    return { damage: rawDamage, wasAvoided: false, defenseNote: null }
  }

  if (effect_type === 'dodge' || effect_type === 'intimidate') {
    const roll = Math.random() * 100
    if (roll < effect_value) {
      return { damage: 0, wasAvoided: true, defenseNote: null }
    }
    return { damage: rawDamage, wasAvoided: false, defenseNote: null }
  }

  if (effect_type === 'slippery') {
    const reduced = Math.round(rawDamage * (1 - effect_value / 100))
    const defenseNote = `${defender.species.name}'s slippery scales reduced the hit from ${rawDamage} to ${reduced}!`
    return { damage: reduced, wasAvoided: false, defenseNote }
  }

  return { damage: rawDamage, wasAvoided: false, defenseNote: null }
}

function resolveAttack(
  attacker: BattleState['player'],
  defender: BattleState['player'],
  move: 'one' | 'two',
) {
  const species = attacker.species
  const isSecondMove = move === 'two'
  const baseDamage = isSecondMove ? (species.attack_two ?? 0) : species.attack
  const moveName = isSecondMove ? species.attack_two_name : species.attack_name
  const missChance = isSecondMove
    ? (species.attack_two_miss_chance ?? 0)
    : species.attack_miss_chance
  const hasOnAttackEffect =
    isSecondMove && species.effect_trigger === 'on_attack'

  if (Math.random() * 100 < missChance) {
    return {
      newDefenderHp: defender.currentHp,
      attackerHpGain: 0,
      poisonInflicted: null,
      logEntry: `${species.name} used ${moveName}, but it missed!`,
    }
  }

  // Level bonus applies to the raw stat first
  const leveledDamage = getLeveledStat(baseDamage, attacker.level)

  // Swarm multiplies hits — applied before type effectiveness
  const swarmMultiplier =
    hasOnAttackEffect && species.effect_type === 'swarm' && species.effect_value
      ? species.effect_value
      : 1

  const typeMultiplier = getTypeMultiplier(species.type, defender.species.type)

  const rawDamage = Math.round(leveledDamage * swarmMultiplier * typeMultiplier)
  const { damage, wasAvoided, defenseNote } = applyPassiveDefense(
    rawDamage,
    defender,
  )
  const newDefenderHp = Math.max(0, defender.currentHp - damage)

  let logEntry: string
  if (wasAvoided) {
    const defenseType =
      defender.species.effect_type === 'intimidate'
        ? `${defender.species.name}'s intimidating presence threw off the attack!`
        : `${defender.species.name} dodged out of the way!`
    logEntry = `${species.name} used ${moveName}, but ${defenseType}`
  } else {
    logEntry = `${species.name} used ${moveName} for ${damage} damage!`
    if (typeMultiplier > 1) logEntry += " It's super effective!"
    else if (typeMultiplier < 1) logEntry += ' Not very effective...'
    if (defenseNote) logEntry += ` ${defenseNote}`
  }

  let attackerHpGain = 0
  if (
    hasOnAttackEffect &&
    species.effect_type === 'lifesteal' &&
    species.effect_value &&
    !wasAvoided
  ) {
    attackerHpGain = Math.round(damage * (species.effect_value / 100))
    logEntry += ` ${species.name} healed ${attackerHpGain} HP!`
  }

  let poisonInflicted = null
  if (
    hasOnAttackEffect &&
    species.effect_type === 'poison' &&
    species.effect_value &&
    !wasAvoided
  ) {
    poisonInflicted = {
      damage: species.effect_value,
      turnsRemaining: POISON_DURATION,
    }
    logEntry += ` ${defender.species.name} was poisoned!`
  }

  return {
    newDefenderHp,
    attackerHpGain,
    poisonInflicted,
    logEntry,
    wasAvoided,
  }
}

function tickPoison(hp: number, poison: BattleState['playerPoison']) {
  if (!poison) return { hp, poison: null, logEntry: null }
  const newHp = Math.max(0, hp - poison.damage)
  const remaining = poison.turnsRemaining - 1
  const logEntry = `Poison dealt ${poison.damage} damage!`
  return {
    hp: newHp,
    poison: remaining > 0 ? { ...poison, turnsRemaining: remaining } : null,
    logEntry,
  }
}

export const battleReducer = (
  state: BattleState,
  action: BattleAction,
): BattleState => {
  switch (action.type) {
    case 'ATTACK':
    case 'ATTACK_TWO': {
      if (state.turn !== 'player' || state.isGameOver) return state

      const tick = tickPoison(state.player.currentHp, state.playerPoison)
      const log = tick.logEntry ? [...state.log, tick.logEntry] : [...state.log]
      const poisonEvents = tick.logEntry
        ? [{ target: 'player' as const, cause: 'poison' as const }]
        : []

      if (tick.hp <= 0) {
        return {
          ...state,
          player: { ...state.player, currentHp: 0 },
          playerPoison: tick.poison,
          lastEvent: poisonEvents,
          log,
          isGameOver: true,
          winner: 'ai',
        }
      }

      const playerAfterPoison = { ...state.player, currentHp: tick.hp }
      const move = action.type === 'ATTACK_TWO' ? 'two' : 'one'
      const result = resolveAttack(playerAfterPoison, state.ai, move)

      const newPlayerHp = Math.min(
        playerAfterPoison.species.hp,
        playerAfterPoison.currentHp + result.attackerHpGain,
      )
      const isGameOver = result.newDefenderHp <= 0

      const attackEvents = result.wasAvoided
        ? []
        : [
            {
              target: 'ai' as const,
              cause: 'attack' as const,
              attackerType: state.player.species.type,
            },
          ]

      return {
        ...state,
        player: { ...playerAfterPoison, currentHp: newPlayerHp },
        ai: { ...state.ai, currentHp: result.newDefenderHp },
        aiPoison: result.poisonInflicted ?? state.aiPoison,
        playerPoison: tick.poison,
        lastEvent: [...poisonEvents, ...attackEvents],
        log: [...log, result.logEntry],
        isGameOver,
        winner: isGameOver ? 'player' : null,
        turn: isGameOver ? state.turn : 'ai',
      }
    }

    case 'AI_COUNTER': {
      if (state.turn !== 'ai' || state.isGameOver) return state

      const tick = tickPoison(state.ai.currentHp, state.aiPoison)
      const log = tick.logEntry ? [...state.log, tick.logEntry] : [...state.log]
      const poisonEvents = tick.logEntry
        ? [{ target: 'ai' as const, cause: 'poison' as const }]
        : []

      if (tick.hp <= 0) {
        return {
          ...state,
          ai: { ...state.ai, currentHp: 0 },
          aiPoison: tick.poison,
          lastEvent: poisonEvents,
          log,
          isGameOver: true,
          winner: 'player',
        }
      }

      const aiAfterPoison = { ...state.ai, currentHp: tick.hp }
      const move =
        aiAfterPoison.species.attack_two != null && Math.random() < 0.5
          ? 'two'
          : 'one'
      const result = resolveAttack(aiAfterPoison, state.player, move)

      const newAiHp = Math.min(
        aiAfterPoison.species.hp,
        aiAfterPoison.currentHp + result.attackerHpGain,
      )
      const isGameOver = result.newDefenderHp <= 0

      const attackEvents = result.wasAvoided
        ? []
        : [
            {
              target: 'player' as const,
              cause: 'attack' as const,
              attackerType: state.ai.species.type,
            },
          ]

      return {
        ...state,
        ai: { ...aiAfterPoison, currentHp: newAiHp },
        player: { ...state.player, currentHp: result.newDefenderHp },
        playerPoison: result.poisonInflicted ?? state.playerPoison,
        aiPoison: tick.poison,
        lastEvent: [...poisonEvents, ...attackEvents],
        log: [...log, result.logEntry],
        isGameOver,
        winner: isGameOver ? 'ai' : null,
        turn: isGameOver ? state.turn : 'player',
      }
    }

    case 'RESET': {
      return {
        player: {
          ...state.player,
          currentHp: getLeveledStat(
            state.player.species.hp,
            state.player.level,
          ),
        },
        ai: {
          ...state.ai,
          currentHp: getLeveledStat(state.ai.species.hp, state.ai.level),
        },
        turn: 'player',
        log: [],
        isGameOver: false,
        winner: null,
        playerPoison: null,
        aiPoison: null,
        lastEvent: [],
      }
    }

    case 'SET_OPPONENT': {
      const leveledHp = getLeveledStat(action.species.hp, action.level)
      return {
        ...state,
        ai: {
          species: action.species,
          currentHp: leveledHp,
          level: action.level,
        },
        aiPoison: null,
      }
    }

    case 'SET_PLAYER_LEVEL': {
      return {
        ...state,
        player: {
          ...state.player,
          level: action.level,
          currentHp: getLeveledStat(state.player.species.hp, action.level),
        },
      }
    }

    default:
      return state
  }
}

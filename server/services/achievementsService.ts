// server/services/achievementsService.ts
import {
  getAchievementsByUserId,
  hasAchievement,
  insertAchievement,
  getFirstCardSpeciesType,
  getCardCount,
  hasLegendaryCard,
} from '../db/achievements'
import type { AchievementDefinition, AchievementWithStatus, Achievement } from '../../models/types'
import { recordBattleOutcome } from '../db/battleStats'

interface BattleAchievementPayload {
  winner?: 'player' | 'ai'
  opponentWasInvasive?: boolean
}

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  { type: 'first_find', name: 'First Find', description: 'Log your very first species observation.' },
  { type: 'starter_bird', name: 'Fledgling Flight', description: 'Started your collection with a bird.' },
  { type: 'starter_insect', name: 'The Larval Stage', description: 'Started your collection with an insect.' },
  { type: 'starter_plant', name: 'Turning Over a New Leaf', description: 'Started your collection with a plant.' },
  { type: 'ten_observations', name: 'Getting Serious About This', description: 'Log 10 observations.' },
  { type: 'first_legendary', name: 'Once in a Blue Moon', description: 'Caught your first legendary-rarity species.' },
  { type: 'first_win', name: 'On the Board', description: 'Claimed your first victory.' },
  { type: 'first_invasive_defeated', name: 'Not on My Watch', description: 'Won your first battle against an invasive species.' },
]

export async function getAchievementsForUser(userId: string): Promise<AchievementWithStatus[]> {
  const unlocked = await getAchievementsByUserId(userId)
  const unlockedByType = new Map(unlocked.map((achievement) => [achievement.type, achievement]))

  return ACHIEVEMENT_DEFINITIONS.map((definition) => {
    const match = unlockedByType.get(definition.type)
    return {
      ...definition,
      unlocked: Boolean(match),
      unlocked_at: match ? match.unlocked_at : null,
    }
  })
}


async function unlockIfNeeded(userId: string, type: string, name: string, newlyUnlocked: Achievement[]) {
  if (!(await hasAchievement(userId, type))) {
    newlyUnlocked.push(await insertAchievement(userId, type, name))
  }
}

export async function checkAchievements(
  userId: string,
  battleResult?: BattleAchievementPayload,
): Promise<Achievement[]> {
  const newlyUnlocked: Achievement[] = []

  const [cardCount, starterType, isLegendary] = await Promise.all([
    getCardCount(userId),
    getFirstCardSpeciesType(userId),
    hasLegendaryCard(userId),
  ])

    if (battleResult?.winner) {
    await recordBattleOutcome(userId, battleResult.winner === 'player')
  }

  if (cardCount >= 1) {
    await unlockIfNeeded(userId, 'first_find', 'First Find', newlyUnlocked)
  }

  if (starterType === 'bird') {
    await unlockIfNeeded(userId, 'starter_bird', 'Fledgling Flight', newlyUnlocked)
  } else if (starterType === 'insect') {
    await unlockIfNeeded(userId, 'starter_insect', 'The Larval Stage', newlyUnlocked)
  } else if (starterType === 'plant') {
    await unlockIfNeeded(userId, 'starter_plant', 'Turning Over a New Leaf', newlyUnlocked)
  }

  if (cardCount >= 10) {
    await unlockIfNeeded(userId, 'ten_observations', 'Getting Serious About This', newlyUnlocked)
  }

  if (isLegendary) {
    await unlockIfNeeded(userId, 'first_legendary', 'Once in a Blue Moon', newlyUnlocked)
  }

  if (battleResult?.winner === 'player') {
    await unlockIfNeeded(userId, 'first_win', 'On the Board', newlyUnlocked)
  }

  if (battleResult?.winner === 'player' && battleResult.opponentWasInvasive) {
    await unlockIfNeeded(
      userId,
      'first_invasive_defeated',
      'Not on My Watch',
      newlyUnlocked,
    )
  }

  return newlyUnlocked
}
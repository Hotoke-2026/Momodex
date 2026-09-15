import type { SpeciesType } from '../../models/battleTypes'

const TYPE_CYCLE: SpeciesType[] = [
  'bird',
  'herp',
  'insect',
  'plant',
  'fungi',
  'mammal',
]

// Reptile and amphibian species are catalogued separately
// but share identical battle strengths/weakness, both act as 'herp' here
function normalizeType(type: string): string {
  if (type === 'reptile' || type === 'amphibian') {
    return 'herp'
  }
  return type
}

export function getTypeMultiplier(
  attackerType: string,
  defenderType: string,
): number {
  const attackerIndex = TYPE_CYCLE.indexOf(
    normalizeType(attackerType) as SpeciesType,
  )
  const defenderIndex = TYPE_CYCLE.indexOf(
    normalizeType(defenderType) as SpeciesType,
  )

  if (attackerIndex === -1 || defenderIndex === -1) {
    return 1
  }

  const distance =
    (defenderIndex - attackerIndex + TYPE_CYCLE.length) % TYPE_CYCLE.length

  if (distance === 1) {
    return 1.5
  }
  if (distance === TYPE_CYCLE.length - 1) {
    return 0.5
  }
  return 1
}

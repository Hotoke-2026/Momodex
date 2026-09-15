export function getLeveledStat(baseStat: number, level: number): number {
  return Math.round(baseStat * (1 + (level - 1) * 0.1))
}

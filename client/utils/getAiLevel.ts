export function getAiLevel(playerLevel: number): number {
  if (playerLevel <= 1) {
    return 1
  }

  const options = [playerLevel, playerLevel - 1]
  return options[Math.floor(Math.random() * options.length)]
}

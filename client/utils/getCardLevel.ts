export function getCardLevel(captureCount: number): number {
  if (captureCount >= 5) {
    return 4
  }
  if (captureCount >= 4) {
    return 3
  }
  if (captureCount >= 3) {
    return 2
  }
  return 1
}

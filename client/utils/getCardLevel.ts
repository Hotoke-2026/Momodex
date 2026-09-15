export function getCardLevel(captureCount: number): number {
  if (captureCount >= 15) {
    return 4
  }
  if (captureCount >= 10) {
    return 3
  }
  if (captureCount >= 5) {
    return 2
  }
  return 1
}

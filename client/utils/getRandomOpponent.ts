export interface OpponentOption {
  id: string
  name: string
}

export function getRandomOpponent(pool: OpponentOption[]): OpponentOption {
  if (pool.length === 0) {
    throw new Error('There seems to be no enemies')
  }

  const randomIndex = Math.floor(Math.random() * pool.length)
  return pool[randomIndex]
}

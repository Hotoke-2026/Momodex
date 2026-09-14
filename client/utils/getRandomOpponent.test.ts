import { describe, it, expect } from 'vitest'
import { getRandomOpponent } from './getRandomOpponent'

describe('getRandomOpponent', () => {
  const pool = [
    { id: 'tui', name: 'Tūī' },
    { id: 'possum', name: 'Common Brushtail Possum' },
    { id: 'kea', name: 'Kea' },
  ]

  it('returns an item that exists in the pool', () => {
    const result = getRandomOpponent(pool)
    expect(pool).toContainEqual(result)
  })

  it('returns the only item when the pool has exactly one', () => {
    const singlePool = [{ id: 'kiwi', name: 'Kiwi' }]
    expect(getRandomOpponent(singlePool)).toEqual(singlePool[0])
  })

  it('throws when the pool is empty', () => {
    expect(() => getRandomOpponent([])).toThrow('There seems to be no enemies')
  })
})

import { describe, it, expect } from 'vitest'
import { getLeveledStat } from './getLeveledStat'

describe('getLeveledStat', () => {
  it('returns the base stat unchanged at level 1', () => {
    expect(getLeveledStat(20, 1)).toBe(20)
  })

  it('applies a 10% increase at level 2', () => {
    expect(getLeveledStat(20, 2)).toBe(22)
  })

  it('applies a 20% increase at level 3', () => {
    expect(getLeveledStat(20, 3)).toBe(24)
  })

  it('applies a 30% increase at level 4', () => {
    expect(getLeveledStat(20, 4)).toBe(26)
  })

  it('rounds to the nearest whole number', () => {
    // 15 * 1.1 = 16.5 → should round to 17
    expect(getLeveledStat(15, 2)).toBe(17)
  })
})

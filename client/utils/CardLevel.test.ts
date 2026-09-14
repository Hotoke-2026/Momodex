import { describe, it, expect } from 'vitest'
import { getCardLevel } from './getCardLevel'

describe('getCardLevel', () => {
  it('returns Level 1 for a single capture', () => {
    expect(getCardLevel(1)).toBe(1)
  })

  it('returns Level 1 just below the Level 2 threshold', () => {
    expect(getCardLevel(4)).toBe(1)
  })

  it('returns Level 2 exactly at the threshold', () => {
    expect(getCardLevel(5)).toBe(2)
  })

  it('returns Level 2 just below the Level 3 threshold', () => {
    expect(getCardLevel(9)).toBe(2)
  })

  it('returns Level 3 exactly at the threshold', () => {
    expect(getCardLevel(10)).toBe(3)
  })

  it('returns Level 3 just below the Level 4 threshold', () => {
    expect(getCardLevel(14)).toBe(3)
  })

  it('returns Level 4 exactly at the threshold', () => {
    expect(getCardLevel(15)).toBe(4)
  })

  it('caps at Level 4 for very high capture counts', () => {
    expect(getCardLevel(100)).toBe(4)
  })

  it('returns Level 1 for zero captures', () => {
    expect(getCardLevel(0)).toBe(1)
  })
})

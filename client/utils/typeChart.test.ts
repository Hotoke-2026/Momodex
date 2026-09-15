import { describe, it, expect } from 'vitest'
import { getTypeMultiplier } from './typeChart'

describe('getTypeMultiplier', () => {
  it.each([
    ['bird', 'herp'],
    ['herp', 'insect'],
    ['insect', 'plant'],
    ['plant', 'fungi'],
    ['fungi', 'mammal'],
    ['mammal', 'bird'],
  ])('%s beats %s for 1.5x damage', (attacker, defender) => {
    expect(getTypeMultiplier(attacker, defender)).toBe(1.5)
  })

  it.each([
    ['herp', 'bird'],
    ['insect', 'herp'],
    ['plant', 'insect'],
    ['fungi', 'plant'],
    ['mammal', 'fungi'],
    ['bird', 'mammal'],
  ])('%s is weak against %s for 0.5x damage', (attacker, defender) => {
    expect(getTypeMultiplier(attacker, defender)).toBe(0.5)
  })

  it.each(['bird', 'herp', 'insect', 'plant', 'fungi', 'mammal'])(
    '%s vs itself is neutral (1x)',
    (type) => {
      expect(getTypeMultiplier(type, type)).toBe(1)
    },
  )

  it('treats reptile and amphibian identically to herp', () => {
    expect(getTypeMultiplier('bird', 'reptile')).toBe(1.5)
    expect(getTypeMultiplier('bird', 'amphibian')).toBe(1.5)
    expect(getTypeMultiplier('reptile', 'bird')).toBe(0.5)
    expect(getTypeMultiplier('amphibian', 'insect')).toBe(1.5)
  })

  it('returns neutral for a truly unrecognized type', () => {
    expect(getTypeMultiplier('bird', 'dragon')).toBe(1)
  })
})

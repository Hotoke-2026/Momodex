import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AchievementBadge } from './AchievementBadge.tsx'
import type { AchievementWithStatus } from '../../models/types'

describe('AchievementBadge', () => {
  const achievement: AchievementWithStatus = {
    type: 'starter_bird',
    name: 'Fledgling Flight',
    description: 'Unlocked your first bird',
    unlocked: true,
    unlocked_at: '2026-09-14T00:00:00.000Z',
  }

  it('renders the achievement details and status', () => {
    render(<AchievementBadge achievement={achievement} />)

    expect(screen.getByText('Fledgling Flight')).toBeInTheDocument()
    expect(screen.getByText('Unlocked your first bird')).toBeInTheDocument()
    expect(screen.getByText(/Unlocked\s+9\/14\/2026/i)).toBeInTheDocument()
    expect(screen.getByText('🐦')).toBeInTheDocument()
  })
})

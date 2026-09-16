import { act, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AchievementToastContainer, showAchievementToast } from './AchievementToast'

describe('AchievementToast', () => {
  it('renders an unlock notification when an achievement is triggered', async () => {
    render(<AchievementToastContainer />)

    act(() => {
      showAchievementToast({
        name: 'On the Board',
        description: 'Claimed your first victory.',
      })
    })

    await waitFor(() => {
      expect(screen.getByText('Achievement unlocked')).toBeInTheDocument()
    })
    expect(screen.getByText('On the Board')).toBeInTheDocument()
    expect(screen.getByText('Claimed your first victory.')).toBeInTheDocument()
  })
})

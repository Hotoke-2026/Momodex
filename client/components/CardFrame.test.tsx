import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { CardFrame } from '../components/CardFrame'
import { Card, Species } from '../../models/types'

describe('CardFrame Component', () => {
  const mockSpecies: Species = {
    id: 'sp-1',
    name: 'Kea',
    type: 'Alpine bird',
    hp: 70,
    attack: 20,
    attack_name: 'Wing Attack',
    attack_two: 25,
    attack_two_name: 'Sharp Peck',
    rarity: 'rare',
    status: 'threatened',
    description: 'Pecks at anything shiny it can find.',
    fun_fact: '',
    effect_type: null,
    effect_value: null,
    effect_trigger: null
  }

  const mockCard: Card = {
    id: 1,
    card_name: 'Test Kea Card',
    user_id: 'user-123',
    species_id: 'sp-1',
    image_url: 'https://example.com/kea.jpg',
    location: 'Mount Cook',
    created_at: '2026-01-01',
  }

  it('renders species details, badges, and attack info correctly', () => {
    render(<CardFrame card={mockCard} species={mockSpecies} />)

    // Header checks
    expect(screen.getByText('Kea')).toBeInTheDocument()
    expect(screen.getByText('☆ rare')).toBeInTheDocument()
    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName.toLowerCase() === 'span' &&
          element?.textContent === 'HP 70/70',
      ),
    ).toBeInTheDocument()

    // Image check
    expect(screen.getByAltText('Kea')).toHaveAttribute(
      'src',
      'https://example.com/kea.jpg',
    )

    // Badges
    expect(screen.getByText('Alpine bird')).toBeInTheDocument()
    expect(screen.getByText('threatened')).toBeInTheDocument()

    // Attack details — updated for the two-move system
    expect(screen.getByText('Wing Attack')).toBeInTheDocument()
    expect(screen.getByText('Damage: 20')).toBeInTheDocument()
    expect(screen.getByText('Sharp Peck')).toBeInTheDocument()
    expect(screen.getByText('Damage: 25')).toBeInTheDocument()
    expect(
      screen.getByText('Pecks at anything shiny it can find.'),
    ).toBeInTheDocument()

    // Location check
    expect(screen.getByText('Mount Cook')).toBeInTheDocument()
  })
})

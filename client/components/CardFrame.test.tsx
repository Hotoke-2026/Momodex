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
    rarity: 'rare',
    status: 'threatened',
    description: 'Pecks at anything shiny it can find.',
    fun_fact: '',
    attack_name: '',
    attack_two: null,
    attack_two_name: null,
    effect_type: null,
    effect_value: null,
    effect_trigger: null
  }

  const mockCard: Card = {
    id: 1,
    user_id: 'user-123',
    species_id: 'sp-1',
    image_url: 'https://example.com/kea.jpg',
    location: 'Mount Cook',
    created_at: '2026-01-01',
    card_name: ''
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

    // Attack details
    expect(screen.getByText('Wing Attack')).toBeInTheDocument()
    expect(screen.getByText('Attack: 20')).toBeInTheDocument()
    expect(
      screen.getByText('Pecks at anything shiny it can find.'),
    ).toBeInTheDocument()

    // Location check
    expect(screen.getByText('Mount Cook')).toBeInTheDocument()
  })
})

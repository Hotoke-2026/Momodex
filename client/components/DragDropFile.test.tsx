import { render, screen } from '@testing-library/react'
import { describe, it } from 'vitest'
import DragDropFilePicker from './DragDropFilePicker'

describe('DragDropFilePicker', () => {
  it('renders the component', () => {
    render(<DragDropFilePicker />)
    expect(
      screen.getByText(/Drag a photo here, or choose a file below/i),
    ).toBeInTheDocument()
  })
})

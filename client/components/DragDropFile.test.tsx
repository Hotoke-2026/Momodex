import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import DragDropFilePicker from './DragDropFilePicker'

describe('DragDropFilePicker', () => {
  it('renders the component', () => {
    render(<DragDropFilePicker />)
    expect(
      screen.getByText(/Drag a photo here, or choose a file below/i),
    ).toBeInTheDocument()
  })
  it('handles file input change', () => {
    render(<DragDropFilePicker />)
    const fileInput = screen.getByTestId('file-input') as HTMLInputElement

    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    })

    fireEvent.change(fileInput, { target: { files: [file] } })

    expect(screen.getByAltText('preview')).toBeInTheDocument()
  })
})

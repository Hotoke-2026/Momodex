import '@testing-library/jest-dom'
import { vi } from 'vitest'

// jsdom doesn't implement createObjectURL — stub it so components using it don't crash in tests
global.URL.createObjectURL = vi.fn(() => 'mock-preview-url')
global.URL.revokeObjectURL = vi.fn()

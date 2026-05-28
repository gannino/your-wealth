/**
 * Test suite for ReflectionPrompt knowledge check component
 *
 * Tests the ReflectionPrompt component which provides personal reflection exercises
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ReflectionPrompt from '../../components/assessments/knowledgeChecks/ReflectionPrompt'

describe('ReflectionPrompt Component', () => {
  const mockPrompt = 'Think about a recent financial decision you made. What factors influenced your choice?'
  const mockGuidance = 'Consider your emotions, research, and advice from others. Be honest with yourself.'
  const mockOnComplete = vi.fn()

  beforeEach(() => {
    mockOnComplete.mockClear()
  })

  describe('Rendering', () => {
    it('should render the prompt', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      expect(screen.getByText(mockPrompt)).toBeInTheDocument()
    })

    it('should render the guidance', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      expect(screen.getByText(mockGuidance)).toBeInTheDocument()
    })

    it('should render the reflection icon', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      expect(screen.getByText('💭')).toBeInTheDocument()
    })

    it('should render textarea for response', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      expect(textarea).toBeInTheDocument()
    })

    it('should render Save Reflection button disabled initially', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const saveButton = screen.getByText('Save Reflection')
      expect(saveButton).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
    })

    it('should render Skip for Now button', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      expect(screen.getByText('Skip for Now')).toBeInTheDocument()
    })

    it('should render "Why This Matters" educational card', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      expect(screen.getByText('Why This Matters')).toBeInTheDocument()
    })

    it('should display character count starting at 0', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      expect(screen.getByText('0 characters')).toBeInTheDocument()
    })
  })

  describe('Response Input', () => {
    it('should update response on input', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      fireEvent.change(textarea, { target: { value: 'My reflection response' } })

      expect(textarea).toHaveValue('My reflection response')
    })

    it('should enable Save Reflection button when response is not empty', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      const saveButton = screen.getByText('Save Reflection')

      expect(saveButton).toBeDisabled()

      fireEvent.change(textarea, { target: { value: 'My reflection' } })

      expect(saveButton).not.toBeDisabled()
    })

    it('should update character count as user types', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)

      expect(screen.getByText('0 characters')).toBeInTheDocument()

      fireEvent.change(textarea, { target: { value: 'Hello' } })
      expect(screen.getByText('5 characters')).toBeInTheDocument()

      fireEvent.change(textarea, { target: { value: 'Hello world' } })
      expect(screen.getByText('11 characters')).toBeInTheDocument()
    })
  })

  describe('Submit Functionality', () => {
    it('should call onComplete with response on save', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      fireEvent.change(textarea, { target: { value: 'My thoughtful reflection' } })

      const saveButton = screen.getByText('Save Reflection')
      fireEvent.click(saveButton)

      expect(mockOnComplete).toHaveBeenCalledWith('My thoughtful reflection')
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Skip Functionality', () => {
    it('should call onComplete with empty string on skip', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const skipButton = screen.getByText('Skip for Now')
      fireEvent.click(skipButton)

      expect(mockOnComplete).toHaveBeenCalledWith('')
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    })

    it('should call onComplete with empty string on skip even when response exists', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      fireEvent.change(textarea, { target: { value: 'Some response' } })

      const skipButton = screen.getByText('Skip for Now')
      fireEvent.click(skipButton)

      expect(mockOnComplete).toHaveBeenCalledWith('')
      expect(mockOnComplete).toHaveBeenCalledTimes(1)
    })
  })

  describe('Saved Response Loading', () => {
    it('should load saved response on mount', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
          savedResponse="Previously saved reflection"
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      expect(textarea).toHaveValue('Previously saved reflection')
    })

    it('should display character count for saved response', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
          savedResponse="Saved text"
        />
      )

      // Check that character count is displayed and shows the correct length
      const charCountElement = screen.getByText((content) => {
        return content.includes('character') || content.includes('characters')
      })
      expect(charCountElement).toBeInTheDocument()
      expect(charCountElement.textContent).toContain('Saved text'.length.toString())
    })

    it('should enable Save button when saved response is loaded', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
          savedResponse="Saved response"
        />
      )

      const saveButton = screen.getByText('Save Reflection')
      expect(saveButton).not.toBeDisabled()
    })

    it('should allow editing saved response', () => {
      render(
        <ReflectionPrompt
          prompt={mockPrompt}
          guidance={mockGuidance}
          onComplete={mockOnComplete}
          savedResponse="Original"
        />
      )

      const textarea = screen.getByPlaceholderText(/Share your thoughts/i)
      expect(textarea).toHaveValue('Original')

      fireEvent.change(textarea, { target: { value: 'Modified response' } })
      expect(textarea).toHaveValue('Modified response')

      const saveButton = screen.getByText('Save Reflection')
      fireEvent.click(saveButton)

      expect(mockOnComplete).toHaveBeenCalledWith('Modified response')
    })
  })
})

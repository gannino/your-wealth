/**
 * Test suite for Quiz knowledge check component
 *
 * Tests the Quiz component which provides immediate feedback on knowledge checks
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Quiz from '../../components/assessments/knowledgeChecks/Quiz'

describe('Quiz Component', () => {
  const mockQuiz = {
    id: 'quiz-1',
    question: 'What is compound interest?',
    options: [
      { value: 'a', label: 'Simple interest on principal' },
      { value: 'b', label: 'Interest on interest' },
      { value: 'c', label: 'Bank fees' },
    ],
    correctAnswer: 'b',
    explanation: 'Compound interest means you earn interest on your interest, creating exponential growth.',
  }

  const mockOnComplete = vi.fn()

  beforeEach(() => {
    mockOnComplete.mockClear()
  })

  describe('Rendering', () => {
    it('should render the question', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      expect(screen.getByText('What is compound interest?')).toBeInTheDocument()
    })

    it('should render all options', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      expect(screen.getByText('Simple interest on principal')).toBeInTheDocument()
      expect(screen.getByText('Interest on interest')).toBeInTheDocument()
      expect(screen.getByText('Bank fees')).toBeInTheDocument()
    })

    it('should render submit button disabled initially', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const submitButton = screen.getByText('Submit')
      expect(submitButton).toBeInTheDocument()
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Option Selection', () => {
    it('should enable submit button after selecting an option', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const submitButton = screen.getByText('Submit')
      expect(submitButton).not.toBeDisabled()
    })

    it('should highlight selected option', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      // Check that the option button has the selected styling
      expect(optionB.closest('button')).toHaveClass('border-primary-purple')
    })
  })

  describe('Submit with Correct Answer', () => {
    it('should show correct feedback when submitting correct answer', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Should show success message
      expect(screen.getByText('Correct!')).toBeInTheDocument()

      // Should show explanation
      expect(screen.getByText(/Compound interest means you earn interest on your interest/)).toBeInTheDocument()

      // Should show continue button
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })

    it('should highlight correct answer in green', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Check for green border on correct answer
      expect(optionB.closest('button')).toHaveClass('border-green-400')
    })

    it('should show try again button is not present for correct answers', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      expect(screen.queryByText('Try Again')).not.toBeInTheDocument()
    })
  })

  describe('Submit with Incorrect Answer', () => {
    it('should show incorrect feedback when submitting wrong answer', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Should show incorrect message
      expect(screen.getByText('Incorrect')).toBeInTheDocument()

      // Should show explanation
      expect(screen.getByText(/Compound interest means you earn interest on your interest/)).toBeInTheDocument()

      // Should show try again button
      expect(screen.getByText('Try Again')).toBeInTheDocument()
    })

    it('should highlight selected incorrect answer in red', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Check for red border on incorrect answer
      expect(optionA.closest('button')).toHaveClass('border-red-400')
    })

    it('should highlight correct answer in green when wrong answer submitted', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // The correct answer should also be highlighted
      const optionB = screen.getByText('Interest on interest')
      expect(optionB.closest('button')).toHaveClass('border-green-400')
    })
  })

  describe('Try Again Functionality', () => {
    it('should reset quiz state when clicking try again', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      // Select wrong answer
      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Click try again
      const tryAgainButton = screen.getByText('Try Again')
      fireEvent.click(tryAgainButton)

      // Should not show feedback anymore
      expect(screen.queryByText('Incorrect')).not.toBeInTheDocument()

      // Submit button should be disabled again
      const newSubmitButton = screen.getByText('Submit')
      expect(newSubmitButton).toBeDisabled()
    })

    it('should allow selecting different answer after try again', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      // Select wrong answer
      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      // Click try again
      const tryAgainButton = screen.getByText('Try Again')
      fireEvent.click(tryAgainButton)

      // Select correct answer
      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      // Submit should be enabled
      const newSubmitButton = screen.getByText('Submit')
      expect(newSubmitButton).not.toBeDisabled()
    })
  })

  describe('Continue Functionality', () => {
    it('should call onComplete with correct score when answer is correct', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      const continueButton = screen.getByText('Continue')
      fireEvent.click(continueButton)

      expect(mockOnComplete).toHaveBeenCalledWith({
        score: 100,
        passed: true,
        answers: { 'quiz-1': 'b' },
      })
    })

    it('should call onComplete with zero score when answer is incorrect', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      const tryAgainButton = screen.getByText('Try Again')
      fireEvent.click(tryAgainButton)

      // Select correct answer this time
      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const newSubmitButton = screen.getByText('Submit')
      fireEvent.click(newSubmitButton)

      const continueButton = screen.getByText('Continue')
      fireEvent.click(continueButton)

      expect(mockOnComplete).toHaveBeenCalledWith({
        score: 100,
        passed: true,
        answers: { 'quiz-1': 'b' },
      })
    })
  })

  describe('Visual Feedback', () => {
    it('should apply teal border to selected option before submission', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      expect(optionB.closest('button')).toHaveClass('border-primary-purple')
    })

    it('should show green feedback card for correct answer', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionB = screen.getByText('Interest on interest')
      fireEvent.click(optionB)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      const feedbackCard = screen.getByText('Correct!').closest('div')
      expect(feedbackCard).toHaveClass('border-green-400/30')
      expect(feedbackCard).toHaveClass('bg-green-400/10')
    })

    it('should show red feedback card for incorrect answer', () => {
      render(<Quiz quiz={mockQuiz} onComplete={mockOnComplete} />)

      const optionA = screen.getByText('Simple interest on principal')
      fireEvent.click(optionA)

      const submitButton = screen.getByText('Submit')
      fireEvent.click(submitButton)

      const feedbackCard = screen.getByText('Incorrect').closest('div')
      expect(feedbackCard).toHaveClass('border-red-400/30')
      expect(feedbackCard).toHaveClass('bg-red-400/10')
    })
  })
})

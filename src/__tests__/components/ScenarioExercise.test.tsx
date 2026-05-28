/**
 * Test suite for ScenarioExercise component
 *
 * Tests the ScenarioExercise component which presents real-world scenarios for applied learning
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ScenarioExercise from '../../components/assessments/knowledgeChecks/ScenarioExercise'

describe('ScenarioExercise Component', () => {
  const mockScenario = {
    id: 'scenario-1',
    title: 'Investment Decision',
    scenario: 'You have $10,000 to invest and are considering two options: a high-risk cryptocurrency with potential 200% returns or a stable index fund with historical 8% annual returns. You are 30 years old and have a stable income.',
    question: 'Based on the principles of asset allocation and risk management, which approach would be most appropriate?',
    options: [
      {
        value: 'a',
        label: 'Invest all $10,000 in cryptocurrency for maximum returns',
        feedback: 'While high returns are attractive, putting all your money in a single high-risk asset violates the principle of diversification and could result in total loss.',
        isCorrect: false,
      },
      {
        value: 'b',
        label: 'Invest $7,000 in the index fund and $3,000 in cryptocurrency',
        feedback: 'Correct! This approach balances growth potential with safety, following the principle of not risking more than you can afford to lose while maintaining diversification.',
        isCorrect: true,
      },
      {
        value: 'c',
        label: 'Keep the money in cash until you are certain about the market',
        feedback: 'While cash feels safe, inflation erodes its value over time. The key is finding an appropriate risk level, not avoiding risk entirely.',
        isCorrect: false,
      },
    ],
  }

  const mockOnComplete = vi.fn()

  beforeEach(() => {
    mockOnComplete.mockClear()
  })

  describe('Rendering', () => {
    it('should render the scenario title', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      expect(screen.getByText('Investment Decision')).toBeInTheDocument()
    })

    it('should render the scenario description', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      expect(screen.getByText(/You have \$10,000 to invest/)).toBeInTheDocument()
    })

    it('should render the question', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      expect(
        screen.getByText(/Based on the principles of asset allocation and risk management/)
      ).toBeInTheDocument()
    })

    it('should render all options', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      expect(
        screen.getByText('Invest all $10,000 in cryptocurrency for maximum returns')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Invest $7,000 in the index fund and $3,000 in cryptocurrency')
      ).toBeInTheDocument()
      expect(
        screen.getByText('Keep the money in cash until you are certain about the market')
      ).toBeInTheDocument()
    })

    it('should not show continue button initially', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      expect(screen.queryByText('Continue')).not.toBeInTheDocument()
    })
  })

  describe('Option Selection', () => {
    it('should highlight selected option with green if correct', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionB = screen.getByText(
        'Invest $7,000 in the index fund and $3,000 in cryptocurrency'
      )
      fireEvent.click(optionB)

      expect(optionB.closest('button')).toHaveClass('border-green-400')
    })

    it('should highlight selected option with red if incorrect', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionA = screen.getByText(
        'Invest all $10,000 in cryptocurrency for maximum returns'
      )
      fireEvent.click(optionA)

      expect(optionA.closest('button')).toHaveClass('border-red-400')
    })

    it('should not allow changing selection after feedback', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionA = screen.getByText(
        'Invest all $10,000 in cryptocurrency for maximum returns'
      )
      fireEvent.click(optionA)

      const optionB = screen.getByText(
        'Invest $7,000 in the index fund and $3,000 in cryptocurrency'
      )

      // Option B should be disabled
      expect(optionB.closest('button')).toBeDisabled()
    })
  })

  describe('Feedback Display', () => {
    it('should show feedback after selecting an option', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionB = screen.getByText(
        'Invest $7,000 in the index fund and $3,000 in cryptocurrency'
      )
      fireEvent.click(optionB)

      // Should show feedback
      expect(screen.getByText(/Correct! This approach balances/)).toBeInTheDocument()

      // Should show continue button
      expect(screen.getByText('Continue')).toBeInTheDocument()
    })

    it('should show green feedback card for correct answer', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionB = screen.getByText(
        'Invest $7,000 in the index fund and $3,000 in cryptocurrency'
      )
      fireEvent.click(optionB)

      const feedbackCard = screen.getByText('Correct!').closest('div')
      expect(feedbackCard).toHaveClass('border-green-400/30')
      expect(feedbackCard).toHaveClass('bg-green-400/10')
    })

    it('should show red feedback card for incorrect answer', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionA = screen.getByText(
        'Invest all $10,000 in cryptocurrency for maximum returns'
      )
      fireEvent.click(optionA)

      const feedbackCard = screen.getByText(/Incorrect/).closest('div')
      expect(feedbackCard).toHaveClass('border-red-400/30')
      expect(feedbackCard).toHaveClass('bg-red-400/10')
    })

    it('should disable options after selection', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionA = screen.getByText(
        'Invest all $10,000 in cryptocurrency for maximum returns'
      )
      fireEvent.click(optionA)

      // Options should be disabled after selection
      expect(optionA.closest('button')).toBeDisabled()
    })
  })

  describe('Continue Functionality', () => {
    it('should call onComplete with true when answer is correct', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionB = screen.getByText(
        'Invest $7,000 in the index fund and $3,000 in cryptocurrency'
      )
      fireEvent.click(optionB)

      const continueButton = screen.getByText('Continue')
      fireEvent.click(continueButton)

      expect(mockOnComplete).toHaveBeenCalledWith(true)
    })

    it('should call onComplete with false when answer is incorrect', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionA = screen.getByText(
        'Invest all $10,000 in cryptocurrency for maximum returns'
      )
      fireEvent.click(optionA)

      const continueButton = screen.getByText('Continue')
      fireEvent.click(continueButton)

      expect(mockOnComplete).toHaveBeenCalledWith(false)
    })
  })

  describe('Visual Feedback', () => {
    it('should highlight correct answer in green after selection', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionB = screen.getByText(
        'Invest $7,000 in the index fund and $3,000 in cryptocurrency'
      )
      fireEvent.click(optionB)

      expect(optionB.closest('button')).toHaveClass('border-green-400')
    })

    it('should highlight incorrect answer in red after selection', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const optionA = screen.getByText(
        'Invest all $10,000 in cryptocurrency for maximum returns'
      )
      fireEvent.click(optionA)

      expect(optionA.closest('button')).toHaveClass('border-red-400')
    })
  })

  describe('Scenario Card Styling', () => {
    it('should render scenario in a dark card with border', () => {
      render(<ScenarioExercise scenario={mockScenario} onComplete={mockOnComplete} />)

      const scenarioCard = screen.getByText('Investment Decision').closest('div')
      expect(scenarioCard).toHaveClass('bg-dark-bg')
      expect(scenarioCard).toHaveClass('border-dark-border')
    })
  })
})

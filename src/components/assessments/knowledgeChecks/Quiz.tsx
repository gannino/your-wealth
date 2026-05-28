import { useState } from 'react'

interface QuizOption {
  value: string
  label: string
}

interface QuizData {
  id: string
  question: string
  options: QuizOption[]
  correctAnswer: string
  explanation: string
}

interface QuizProps {
  quiz: QuizData
  onComplete: (result: { score: number; passed: boolean; answers: Record<string, string> }) => void
}

export default function Quiz({ quiz, onComplete }: QuizProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleOptionSelect = (value: string) => {
    if (!hasSubmitted) {
      setSelectedOption(value)
    }
  }

  const handleSubmit = () => {
    if (selectedOption === null) return

    const correct = selectedOption === quiz.correctAnswer
    setIsCorrect(correct)
    setHasSubmitted(true)
  }

  const handleTryAgain = () => {
    setSelectedOption(null)
    setHasSubmitted(false)
    setIsCorrect(false)
  }

  const handleContinue = () => {
    onComplete({
      score: isCorrect ? 100 : 0,
      passed: isCorrect,
      answers: { [quiz.id]: selectedOption! },
    })
  }

  const isOptionSelected = (value: string) => selectedOption === value
  const isOptionCorrect = (value: string) => value === quiz.correctAnswer

  return (
    <div className="space-y-6">
      {/* Question */}
      <h3 className="text-xl font-semibold text-white">{quiz.question}</h3>

      {/* Options */}
      <div className="space-y-3">
        {quiz.options.map((option) => {
          const isSelected = isOptionSelected(option.value)
          const isCorrectOption = isOptionCorrect(option.value)

          let buttonClasses =
            'w-full text-left px-6 py-4 rounded-lg border transition-all '

          if (!hasSubmitted) {
            // Before submission
            buttonClasses += isSelected
              ? 'bg-primary-purple/20 border-primary-purple'
              : 'bg-dark-bg border-dark-border hover:border-primary-purple'
          } else {
            // After submission
            if (isCorrectOption) {
              buttonClasses += 'bg-green-400/20 border-green-400'
            } else if (isSelected) {
              buttonClasses += 'bg-red-400/20 border-red-400'
            } else {
              buttonClasses += 'bg-dark-bg border-dark-border'
            }
          }

          return (
            <button
              key={option.value}
              onClick={() => handleOptionSelect(option.value)}
              disabled={hasSubmitted}
              className={`${buttonClasses} ${!hasSubmitted ? 'hover:bg-primary-purple/10' : 'cursor-default'}`}
            >
              <span className="text-gray-200 font-semibold">{option.label}</span>
              {hasSubmitted && isCorrectOption && (
                <span className="ml-2 text-green-400">✓</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {hasSubmitted && (
        <div
          className={`p-6 rounded-lg border ${
            isCorrect
              ? 'bg-green-400/10 border-green-400/30'
              : 'bg-red-400/10 border-red-400/30'
          }`}
        >
          <h4 className={`text-lg font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h4>
          <p className="text-gray-300">{quiz.explanation}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        {!hasSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="px-6 py-3 rounded-lg bg-primary-purple hover:bg-purple-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit
          </button>
        ) : (
          <>
            {!isCorrect && (
              <button
                onClick={handleTryAgain}
                className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
              >
                Try Again
              </button>
            )}
            <button
              onClick={handleContinue}
              className="px-6 py-3 rounded-lg bg-primary-purple hover:bg-purple-600 text-white font-semibold transition-colors"
            >
              Continue
            </button>
          </>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'

interface ScenarioOption {
  value: string
  label: string
  feedback: string
  isCorrect: boolean
}

interface ScenarioData {
  id: string
  title: string
  scenario: string
  question: string
  options: ScenarioOption[]
}

interface ScenarioExerciseProps {
  scenario: ScenarioData
  onComplete: (passed: boolean) => void
}

export default function ScenarioExercise({ scenario, onComplete }: ScenarioExerciseProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const handleOptionSelect = (value: string) => {
    if (!hasSubmitted) {
      setSelectedOption(value)
      setHasSubmitted(true)
    }
  }

  const handleContinue = () => {
    if (selectedOption === null) return

    const selectedOptionData = scenario.options.find((opt) => opt.value === selectedOption)
    const passed = selectedOptionData?.isCorrect ?? false

    onComplete(passed)
  }

  const isOptionSelected = (value: string) => selectedOption === value
  const isOptionCorrect = (value: string) => {
    const option = scenario.options.find((opt) => opt.value === value)
    return option?.isCorrect ?? false
  }

  const getSelectedFeedback = () => {
    if (selectedOption === null) return null
    const option = scenario.options.find((opt) => opt.value === selectedOption)
    return option?.feedback ?? null
  }

  const isSelectionCorrect = () => {
    if (selectedOption === null) return false
    const option = scenario.options.find((opt) => opt.value === selectedOption)
    return option?.isCorrect ?? false
  }

  return (
    <div className="space-y-6">
      {/* Scenario Card */}
      <div className="bg-dark-bg border-dark-border rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{scenario.title}</h3>
        <p className="text-gray-300 mb-6 leading-relaxed">{scenario.scenario}</p>
        <h4 className="text-lg font-semibold text-gray-200">{scenario.question}</h4>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {scenario.options.map((option) => {
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
            if (isSelected && isCorrectOption) {
              buttonClasses += 'bg-green-400/20 border-green-400'
            } else if (isSelected && !isCorrectOption) {
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
            isSelectionCorrect()
              ? 'bg-green-400/10 border-green-400/30'
              : 'bg-red-400/10 border-red-400/30'
          }`}
        >
          <h4 className={`text-lg font-semibold mb-2 ${isSelectionCorrect() ? 'text-green-400' : 'text-red-400'}`}>
            {isSelectionCorrect() ? 'Correct!' : 'Incorrect'}
          </h4>
          <p className="text-gray-300">{getSelectedFeedback()}</p>
        </div>
      )}

      {/* Continue Button */}
      {hasSubmitted && (
        <button
          onClick={handleContinue}
          className="px-6 py-3 rounded-lg bg-primary-purple hover:bg-purple-600 text-white font-semibold transition-colors"
        >
          Continue
        </button>
      )}
    </div>
  )
}

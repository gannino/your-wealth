import { useState, useEffect } from 'react'

interface ReflectionPromptProps {
  prompt: string
  guidance: string
  onComplete: (response: string) => void
  savedResponse?: string
}

export default function ReflectionPrompt({
  prompt,
  guidance,
  onComplete,
  savedResponse = '',
}: ReflectionPromptProps) {
  const [response, setResponse] = useState(savedResponse)

  // Load saved response when it changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setResponse(savedResponse)
  }, [savedResponse])

  const handleSave = () => {
    onComplete(response)
  }

  const handleSkip = () => {
    onComplete('')
  }

  const characterCount = response.length

  return (
    <div className="space-y-6">
      {/* Icon Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">💭</span>
        <h3 className="text-xl font-semibold text-white">Reflection</h3>
      </div>

      {/* Prompt */}
      <p className="text-xl text-white font-medium">{prompt}</p>

      {/* Guidance */}
      <p className="text-gray-400 text-sm">{guidance}</p>

      {/* Response Textarea */}
      <div className="space-y-3">
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Share your thoughts and reflections here..."
          className="w-full min-h-[200px] px-6 py-4 rounded-lg bg-dark-bg border border-dark-border text-white placeholder-gray-500 focus:outline-none focus:border-primary-purple resize-y"
        />

        {/* Character Count */}
        <div className="text-right text-sm text-gray-400">
          {characterCount} character{characterCount !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Why This Matters Card */}
      <div className="p-6 rounded-lg border border-primary-teal/30 bg-primary-teal/10">
        <h4 className="text-lg font-semibold text-primary-teal mb-2">Why This Matters</h4>
        <p className="text-gray-300 text-sm">
          Personal reflections help you connect financial concepts to your real-life experiences.
          By thinking deeply about your decisions, you build awareness and make more conscious
          choices aligned with your goals.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={!response.trim()}
          className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Reflection
        </button>

        <button
          onClick={handleSkip}
          className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
        >
          Skip for Now
        </button>
      </div>
    </div>
  )
}

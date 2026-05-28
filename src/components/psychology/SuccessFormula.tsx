import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';

const steps = [
  {
    title: "The Ultimate Success Formula",
    content: "This is the proven pattern that all successful people follow. It's not about luck - it's about a systematic approach to achieving any outcome you desire.",
    formula: ["Know your outcome", "Take massive action", "Notice what's working", "Change your approach until you succeed"]
  },
  {
    title: "Step 1: Know Your Outcome",
    content: "Clarity is power. Most people never achieve what they want because they never clearly define it. You need to be absolutely specific about your financial goals.",
    examples: [
      "Instead of 'I want to be rich', say 'I want $1.2 million in investment assets by age 50'",
      "Instead of 'I want to save money', say 'I will save 15% of my income every month'",
      "Instead of 'I want to be debt-free', say 'I will pay off my mortgage by December 2028'"
    ]
  },
  {
    title: "Step 2: Take Massive Action",
    content: "Knowing isn't enough - you must take action. Not just any action, but MASSIVE action. This means doing whatever it takes, pushing through fear, and acting with commitment.",
    keyPoints: [
      "Start before you feel ready",
      "Take action even when you're afraid",
      "Do more than the minimum required",
      "Commit fully, don't leave yourself an escape route"
    ]
  },
  {
    title: "Step 3: Notice What's Working",
    content: "You must pay attention to the results you're getting. Are you moving closer to your goals or further away? This requires brutal honesty with yourself.",
    questions: [
      "Which investments are performing best?",
      "Where am I wasting money?",
      "What habits are helping me save?",
      "What expenses can I reduce?"
    ]
  },
  {
    title: "Step 4: Change Your Approach",
    content: "If what you're doing isn't working, do something else. This is where most people give up. Instead, change your approach and try again. Keep changing until you find what works.",
    wisdom: "Insanity is doing the same thing over and over and expecting different results. If you want different results, take different actions."
  }
] as const;

export default function SuccessFormula() {
  const navigate = useNavigate();
  const { completeStep } = usePsychologyStore();
  const [currentStep, setCurrentStep] = useState(0);

  const handleContinue = () => {
    completeStep(5);
    navigate('/psychology/change-process');
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          <div className="mb-6">
            <span className="text-primary-teal text-sm font-semibold">STEP 5 OF 7</span>
            <h1 className="text-3xl font-bold text-white mt-2">{step.title}</h1>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">{step.content}</p>
          </div>

          {'formula' in step && step.formula && (
            <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-primary-teal mb-4">The Formula</h3>
              <ol className="space-y-3">
                {step.formula.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 bg-primary-teal rounded-full flex items-center justify-center text-white font-bold">
                      {i + 1}
                    </span>
                    <span className="text-gray-200 pt-1">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {'examples' in step && step.examples && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Examples</h3>
              <ul className="space-y-3">
                {step.examples.map((example, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary-purple text-xl">✓</span>
                    <span className="text-gray-300">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {'keyPoints' in step && step.keyPoints && (
            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Key Points</h3>
              <ul className="space-y-3">
                {step.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary-pink text-xl">→</span>
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {'questions' in step && step.questions && (
            <div className="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-primary-purple mb-4">Ask Yourself</h3>
              <ul className="space-y-3">
                {step.questions.map((question, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-primary-purple">?</span>
                    <span className="text-gray-300">{question}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {'wisdom' in step && step.wisdom && (
            <div className="bg-primary-pink/10 border border-primary-pink/30 rounded-lg p-6 mb-8">
              <p className="text-primary-pink text-lg italic">"{step.wisdom}"</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-primary-teal hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            <span className="text-gray-400">
              {currentStep + 1} of {steps.length}
            </span>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                Continue to Change Process →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

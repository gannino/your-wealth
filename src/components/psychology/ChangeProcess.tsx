import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';

const masterSteps = [
  {
    number: 1,
    title: "Get Disturbed",
    description: "You must interrupt your current pattern. Nothing changes until you become genuinely dissatisfied with your current situation.",
    content: "Most people stay in their comfort zone, even when it's uncomfortable. To create change, you must get to the point where you say 'Enough is enough!' This emotional disturbance breaks your old patterns and creates space for something new.",
    action: "What financial situation are you no longer willing to accept?"
  },
  {
    number: 2,
    title: "Get Clear",
    description: "Clarity is power. You must know exactly what you want - be specific.",
    content: "Vague goals produce vague results. Instead of 'I want to be financially secure', define exactly what that means. How much money? By when? What will it give you?",
    action: "What is your specific financial target for the next 12 months?"
  },
  {
    number: 3,
    title: "Get Certain",
    description: "Build absolute certainty that you can achieve your goal.",
    content: "Doubt kills dreams. You need to convince yourself that your goal is possible. Look for evidence - others have done it, you have the skills, you can learn what you need.",
    action: "What evidence do you have that this is achievable?"
  },
  {
    number: 4,
    title: "Get Focused",
    description: "Focus all your resources on your goal - eliminate distractions.",
    content: "What you focus on, you feel. What you feel, you attract. Most people major in minor things - they focus on what they don't want instead of what they do want.",
    action: "What distractions do you need to eliminate?"
  },
  {
    number: 5,
    title: "Get Committed",
    description: "Make an absolute commitment - burn the bridges.",
    content: "Conditional commitment is no commitment at all. You must decide that there is no other option. When you burn the bridges, you find a way to make it happen.",
    action: "What are you willing to sacrifice to achieve your goal?"
  },
  {
    number: 6,
    title: "Take Massive Action",
    description: "Take action now - not later, not tomorrow, but NOW.",
    content: "The universe rewards action, not intention. You must take massive, determined action. Not perfect action - just action. You can course-correct as you go.",
    action: "What is ONE action you can take today?"
  },
  {
    number: 7,
    title: "Notice What's Working",
    description: "Pay attention to feedback - are you getting closer?",
    content: "Success leaves clues. Notice which actions produce results and which don't. Double down on what works, eliminate what doesn't.",
    action: "What feedback are you getting from your current actions?"
  }
] as const;

export default function ChangeProcess() {
  const navigate = useNavigate();
  const { completeStep } = usePsychologyStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [currentStep]: value });
  };

  const handleContinue = () => {
    completeStep(6);
    navigate('/psychology/action-commitment');
  };

  const step = masterSteps[currentStep];
  const progress = ((currentStep + 1) / masterSteps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep + 1} of {masterSteps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-primary-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <span className="text-primary-pink text-sm font-semibold">STEP 6 OF 7</span>

          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-purple to-primary-pink rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{step.number}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{step.title}</h1>
              <p className="text-gray-400 mt-1">{step.description}</p>
            </div>
          </div>

          <div className="bg-dark-bg border border-dark-border rounded-lg p-6 mb-6">
            <p className="text-gray-200 leading-relaxed text-lg">{step.content}</p>
          </div>

          <div className="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-primary-teal mb-3">Your Turn</h3>
            <p className="text-gray-300 mb-4">{step.action}</p>
            <textarea
              value={answers[currentStep] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Write your answer here..."
              rows={4}
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-teal resize-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-primary-teal hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>

            {currentStep < masterSteps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                Next Step →
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold transition-colors"
              >
                Continue to Action Commitment →
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-7 gap-2">
          {masterSteps.map((s, i) => (
            <button
              key={s.number}
              onClick={() => setCurrentStep(i)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                i === currentStep
                  ? 'border-primary-teal bg-primary-teal/20'
                  : i < currentStep
                  ? 'border-green-500/50 bg-green-500/10'
                  : 'border-dark-border bg-dark-bg'
              }`}
            >
              <span className="text-sm font-semibold text-white">{s.number}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

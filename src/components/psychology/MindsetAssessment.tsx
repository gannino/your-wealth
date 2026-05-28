import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';

interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

// Define questions in a fixed order - use as const to prevent reordering
const questions: Question[] = [
  {
    id: 'q1',
    text: "Money is the root of all evil.",
    options: [
      { value: 1, label: 'Strongly Agree' },
      { value: 2, label: 'Somewhat Agree' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Somewhat Disagree' },
      { value: 5, label: 'Strongly Disagree' }
    ]
  },
  {
    id: 'q2',
    text: "I don't deserve to be wealthy.",
    options: [
      { value: 1, label: 'Strongly Agree' },
      { value: 2, label: 'Somewhat Agree' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Somewhat Disagree' },
      { value: 5, label: 'Strongly Disagree' }
    ]
  },
  {
    id: 'q3',
    text: "Rich people are greedy.",
    options: [
      { value: 1, label: 'Strongly Agree' },
      { value: 2, label: 'Somewhat Agree' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Somewhat Disagree' },
      { value: 5, label: 'Strongly Disagree' }
    ]
  },
  {
    id: 'q4',
    text: "I can create multiple streams of income.",
    options: [
      { value: 1, label: 'Strongly Agree' },
      { value: 2, label: 'Somewhat Agree' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Somewhat Disagree' },
      { value: 5, label: 'Strongly Disagree' }
    ]
  },
  {
    id: 'q5',
    text: "I am in control of my financial future.",
    options: [
      { value: 1, label: 'Strongly Agree' },
      { value: 2, label: 'Somewhat Agree' },
      { value: 3, label: 'Neutral' },
      { value: 4, label: 'Somewhat Disagree' },
      { value: 5, label: 'Strongly Disagree' }
    ]
  }
] as const;

export default function MindsetAssessment() {
  const navigate = useNavigate();
  const { setMindsetResponses, completeStep, getMindsetScore } = usePsychologyStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: number) => {
    const question = questions[currentQuestion];
    const updatedAnswers = { ...answers, [question.id]: value };

    if (currentQuestion < questions.length - 1) {
      setAnswers(updatedAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - update answers and calculate results
      setAnswers(updatedAnswers);
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = (finalAnswers: Record<string, number>) => {
    // Only store responses - score calculated on-demand
    setMindsetResponses(finalAnswers);
    setShowResults(true);
  };

  const handleContinue = () => {
    completeStep(2);
    // Always go to limiting beliefs next, regardless of training progress
    navigate('/psychology/limiting-beliefs');
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigate('/');
    }
  };

  if (showResults) {
    const mindsetScore = getMindsetScore();

    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Your Money Mindset Score</h1>

            <div className="mb-8">
              <div className="flex justify-center mb-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-dark-border"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="88"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${mindsetScore * 5.53} 553`}
                      className="text-primary-teal"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl font-bold text-white">{mindsetScore}%</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                {mindsetScore >= 80 ? (
                  <p className="text-green-400 text-lg mb-4">
                    Excellent! You have an empowering money mindset.
                  </p>
                ) : mindsetScore >= 60 ? (
                  <p className="text-yellow-400 text-lg mb-4">
                    Good foundation. There's room for growth.
                  </p>
                ) : (
                  <p className="text-red-400 text-lg mb-4">
                    Your mindset may be limiting your financial potential.
                  </p>
                )}
              </div>
            </div>

            <div className="bg-dark-bg border border-dark-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-primary-purple mb-3">What This Means</h2>
              <p className="text-gray-300 leading-relaxed">
                Your money mindset shapes every financial decision you make. The next steps
                will help you identify limiting beliefs and replace them with empowering ones.
              </p>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Limiting Beliefs →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2">
              <div
                className="bg-primary-teal h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-white mb-8">
            {question.text}
          </h1>

          <div className="space-y-3">
            {question.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full text-left px-6 py-4 bg-dark-bg border border-dark-border hover:border-primary-teal hover:bg-primary-teal/10 rounded-lg transition-all text-gray-200 hover:text-white"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

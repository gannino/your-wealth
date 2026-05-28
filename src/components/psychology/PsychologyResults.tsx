import { useNavigate } from 'react-router-dom';
import { usePsychologyStore, useTrainingStore } from '../../stores';

// Questions data - must match MindsetAssessment.tsx
const QUESTIONS = [
  { id: 'q1', text: "Money is the root of all evil.", negative: true },
  { id: 'q2', text: "I don't deserve to be wealthy.", negative: true },
  { id: 'q3', text: "Rich people are greedy.", negative: true },
  { id: 'q4', text: "I can create multiple streams of income.", negative: false },
  { id: 'q5', text: "I am in control of my financial future.", negative: false },
];

const getAnswerLabel = (value: number) => {
  const labels = ['Strongly Agree', 'Somewhat Agree', 'Neutral', 'Somewhat Disagree', 'Strongly Disagree'];
  return labels[value - 1] || 'N/A';
};

export default function PsychologyResults() {
  const navigate = useNavigate();
  const {
    getMindsetScore,
    mindsetResponses,
    limitingBeliefs,
    empoweringBeliefs,
    actionCommitments,
    stepsCompleted,
    reflectionResponses,
    resetTraining,
    clearMindsetResponses
  } = usePsychologyStore();

  const { reflections } = useTrainingStore();

  const mindsetScore = getMindsetScore();

  const handleRetakeMindset = () => {
    // Clear responses before navigating so user can retake assessment
    clearMindsetResponses();
    navigate('/psychology/mindset-assessment');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all psychology assessment? This will delete all your progress.')) {
      resetTraining();
      navigate('/');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent! You have an empowering money mindset.';
    if (score >= 60) return 'Good foundation. There\'s room for growth.';
    return 'Your mindset may be limiting your financial potential.';
  };

  const getScoreRecommendation = (score: number) => {
    if (score >= 80) return 'Focus on maintaining your positive mindset and supporting others.';
    if (score >= 60) return 'Continue working on identifying and transforming limiting beliefs.';
    return 'Start with the belief transformation exercises to build a stronger foundation.';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white text-sm mb-4 flex items-center gap-2"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">Your Psychology Assessment Results</h1>
          <p className="text-gray-400">
            Completed {stepsCompleted.length} of 6 training steps •
            {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Mindset Score */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Money Mindset Score</h2>

          <div className="flex justify-center mb-8">
            <div className="relative w-56 h-56">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-dark-border"
                />
                <circle
                  cx="112"
                  cy="112"
                  r="100"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${mindsetScore * 6.28} 628`}
                  className={getScoreColor(mindsetScore)}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-6xl font-bold text-white">{mindsetScore}%</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <p className={`text-xl font-semibold mb-4 ${getScoreColor(mindsetScore)}`}>
              {getScoreLabel(mindsetScore)}
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {getScoreRecommendation(mindsetScore)}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handleRetakeMindset}
              className="px-6 py-3 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal/10 transition-colors"
            >
              Retake Assessment
            </button>
          </div>
        </div>

        {/* Your Mindset Responses */}
        {Object.keys(mindsetResponses).length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Mindset Assessment Responses</h2>
            <p className="text-gray-400 mb-6">
              Here's what you told us about your money mindset. Review these responses to understand your starting point.
            </p>

            <div className="space-y-4">
              {QUESTIONS.map((question) => {
                const response = mindsetResponses[question.id];
                if (!response) return null;

                // Response scale: 1 = Strongly Agree, 2 = Somewhat Agree, 3 = Neutral, 4 = Somewhat Disagree, 5 = Strongly Disagree
                // For negative questions (e.g., "Money is evil"): Disagreeing (4-5) is Empowering
                // For positive questions (e.g., "I can create income"): Agreeing (1-2) is Empowering
                const isEmpowering = question.negative ? (response >= 4) : (response <= 2);
                const isNeutral = response === 3;

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border ${
                      isEmpowering
                        ? 'bg-green-400/10 border-green-400/30'
                        : isNeutral
                        ? 'bg-yellow-400/10 border-yellow-400/30'
                        : 'bg-red-400/10 border-red-400/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-white font-medium mb-2">{question.text}</p>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-semibold ${
                            isEmpowering ? 'text-green-400' : isNeutral ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {getAnswerLabel(response)}
                          </span>
                          {isEmpowering ? (
                            <span className="text-green-400 text-sm">✓ Empowering</span>
                          ) : isNeutral ? (
                            <span className="text-yellow-400 text-sm">~ Neutral</span>
                          ) : (
                            <span className="text-red-400 text-sm">⚠️ Limiting</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Training Module Reflections */}
        {(Object.keys(reflections).length > 0 || Object.keys(reflectionResponses).length > 0) && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Training Reflections</h2>
            <p className="text-gray-400 mb-6">
              Your personal reflections from the wealth mastery training modules and psychology exercises.
            </p>

            <div className="space-y-4">
              {/* Training module reflections */}
              {Object.entries(reflections).map(([key, value]) => {
                if (!value?.response) return null;
                const titleMap: Record<string, string> = {
                  'module-1-reflection': 'Module 1: Foundation - Your Money Story',
                  'module-2-reflection': 'Module 2: Myth-Busting - Fee Awareness',
                  'module-3-reflection': 'Module 3: Strategy - Asset Allocation',
                  'module-4-reflection': 'Module 4: Execution - Advisor Selection',
                  'module-5-reflection': 'Module 5: Mastery - Market Psychology',
                };
                return (
                  <div key={key} className="bg-dark-bg border border-primary-purple/30 rounded-lg p-4">
                    <h3 className="text-primary-purple font-semibold mb-2">{titleMap[key] || key}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{value.response}</p>
                    {value.updatedAt && (
                      <p className="text-gray-500 text-xs mt-2">
                        Reflected on {new Date(value.updatedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Psychology reflection responses */}
              {Object.entries(reflectionResponses).map(([key, value]) => {
                if (!value) return null;
                const titleMap: Record<string, string> = {
                  'limiting-beliefs': 'Limiting Beliefs Reflection',
                  'belief-transformation': 'Belief Transformation Reflection',
                  'success-formula': 'Success Formula Reflection',
                };
                return (
                  <div key={key} className="bg-dark-bg border border-primary-teal/30 rounded-lg p-4">
                    <h3 className="text-primary-teal font-semibold mb-2">{titleMap[key] || key}</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">{value}</p>
                  </div>
                );
              })}
            </div>

            {(Object.keys(reflections).length === 0 && Object.keys(reflectionResponses).length === 0) && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📝</div>
                <p className="text-gray-400">No reflections yet. Complete training modules to see your personal reflections here.</p>
              </div>
            )}
          </div>
        )}

        {/* Training Progress */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Training Progress</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { step: 1, name: 'Mindset Assessment', completed: stepsCompleted.includes(2), icon: '📊' },
              { step: 2, name: 'Limiting Beliefs', completed: stepsCompleted.includes(3), icon: '🔍' },
              { step: 3, name: 'Belief Transformation', completed: stepsCompleted.includes(4), icon: '🔄' },
              { step: 4, name: 'Success Formula', completed: stepsCompleted.includes(5), icon: '🎯' },
              { step: 5, name: 'Change Process', completed: stepsCompleted.includes(6), icon: '⚡' },
              { step: 6, name: 'Action Commitment', completed: stepsCompleted.includes(7), icon: '✅' },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-4 rounded-lg border-2 transition-all ${
                  item.completed
                    ? 'border-primary-teal bg-primary-teal/10'
                    : 'border-dark-border bg-dark-bg'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{item.icon}</span>
                  <div className={`flex-1 ${item.completed ? 'text-white' : 'text-gray-500'}`}>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm">
                      {item.completed ? 'Completed' : 'Not started'}
                    </div>
                  </div>
                  {item.completed && (
                    <svg className="w-6 h-6 text-primary-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 01-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Limiting Beliefs */}
        {limitingBeliefs.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Limiting Beliefs Identified</h2>
            <p className="text-gray-400 mb-6">
              These are the money beliefs that may be holding you back from financial success.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {limitingBeliefs.map((item, index) => (
                <div
                  key={index}
                  className="bg-red-400/10 border border-red-400/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-red-400 text-xl">⚠️</span>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{item.belief}</p>
                      <p className="text-gray-400 text-sm">
                        Identified {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
              <h3 className="text-lg font-semibold text-primary-purple mb-3">💡 Transformation Exercise</h3>
              <p className="text-gray-300">
                For each limiting belief, create an empowering alternative. Replace "I don't deserve wealth"
                with "I am worthy of financial abundance and success."
              </p>
            </div>
          </div>
        )}

        {/* Empowering Beliefs */}
        {empoweringBeliefs.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Empowering Beliefs Installed</h2>
            <p className="text-gray-400 mb-6">
              These are the new positive beliefs you've chosen to replace limiting ones.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {empoweringBeliefs.map((item, index) => (
                <div
                  key={index}
                  className="bg-green-400/10 border border-green-400/30 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-green-400 text-xl">✨</span>
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{item.belief}</p>
                      <p className="text-gray-400 text-sm">
                        Installed {formatDate(item.date)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
              <h3 className="text-lg font-semibold text-primary-teal mb-3">🔄 Reinforcement Tip</h3>
              <p className="text-gray-300">
                Read your empowering beliefs daily, preferably in the morning. Say them out loud
                with emotion. Over time, they will become your automatic thinking pattern.
              </p>
            </div>
          </div>
        )}

        {/* Action Commitments */}
        {actionCommitments.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Your Action Commitments</h2>
            <p className="text-gray-400 mb-6">
              These are the specific actions you've committed to taking. A commitment without action is just a wish.
            </p>

            <div className="space-y-4">
              {actionCommitments.map((item, index) => (
                <div
                  key={index}
                  className={`bg-dark-bg border rounded-lg p-4 ${
                    isOverdue(item.deadline)
                      ? 'border-red-400/50'
                      : 'border-primary-purple/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-primary-purple text-xl">✓</span>
                      <div>
                        <p className="text-white font-medium mb-1">{item.commitment}</p>
                        <p className={`text-sm ${isOverdue(item.deadline) ? 'text-red-400' : 'text-gray-400'}`}>
                          Due: {formatDate(item.deadline)}
                          {isOverdue(item.deadline) && ' (Overdue)'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-primary-purple/10 border border-primary-purple/30 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-purple mb-3">🎯 Success Tips</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary-purple">→</span>
                  <span>Review your commitments weekly and celebrate each one you complete</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-purple">→</span>
                  <span>Share your commitments with an accountability partner</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-purple">→</span>
                  <span>Start small - build momentum with achievable commitments</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* No Data Message */}
        {limitingBeliefs.length === 0 && empoweringBeliefs.length === 0 && actionCommitments.length === 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-white mb-2">No Training Data Yet</h3>
            <p className="text-gray-400 mb-6">
              Complete the psychology assessment to see your detailed results here.
            </p>
            <button
              onClick={() => navigate('/psychology/mindset-assessment')}
              className="bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Training →
            </button>
          </div>
        )}

        {/* Action Buttons */}
        {stepsCompleted.length > 0 && (
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/assessments/blueprint')}
              className="flex-1 bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Continue to Blueprint Assessment →
            </button>
            <button
              onClick={() => navigate('/psychology/action-commitment')}
              className="flex-1 bg-primary-purple hover:bg-primary-purple/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Add More Commitments →
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-red-400 text-red-400 hover:bg-red-400/10 transition-colors"
            >
              Reset Training
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

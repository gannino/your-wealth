import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore, useAssessmentStore, useFinancialPlanStore } from '../../stores';
import { useCurrency } from '../../hooks/useCurrency';
import DataManagement from '../shared/DataManagement';

export function Welcome() {
  const navigate = useNavigate();
  const { setCurrentStep, stepsCompleted, getMindsetScore, clearMindsetResponses } = usePsychologyStore();
  const { blueprintAssessment, setBlueprintAssessment, getBlueprintScores } = useAssessmentStore();
  const { financialData, setFinancialData } = useFinancialPlanStore();
  const { getSymbol } = useCurrency();
  const currencySymbol = getSymbol();

  const [showRetakeWarning, setShowRetakeWarning] = useState(false);
  const [retakeType, setRetakeType] = useState<'psychology' | 'blueprint' | 'financial'>();
  const [showSkipWarning, setShowSkipWarning] = useState(false);

  const hasCompletedTraining = stepsCompleted.includes(7);
  const hasCompletedAssessment = blueprintAssessment !== null;
  const hasCompletedFinancialData = financialData !== null;

  const handleContinue = () => {
    if (!hasCompletedTraining) {
      setCurrentStep(1);
      navigate('/psychology/mindset-assessment');
    } else if (!hasCompletedAssessment) {
      navigate('/assessments/blueprint');
    } else if (!hasCompletedFinancialData) {
      navigate('/assessments/currency');
    } else {
      navigate('/assessments/currency');
    }
  };

  const handleRestart = () => {
    setRetakeType('psychology');
    setShowRetakeWarning(true);
  };

  const handleRetakeBlueprint = () => {
    setRetakeType('blueprint');
    setShowRetakeWarning(true);
  };

  const getContinueLabel = () => {
    if (!hasCompletedTraining) return 'Begin Your Journey →';
    if (!hasCompletedAssessment) return 'Continue to Financial Assessment →';
    if (!hasCompletedFinancialData) return 'Continue to Financial Data →';
    return 'Review Financial Plan →';
  };

  const handleStartTraining = () => {
    navigate('/training/hub');
  };

  const handleSkipToAssessments = () => {
    if (!hasCompletedTraining) {
      setShowSkipWarning(true);
    } else if (!hasCompletedAssessment) {
      navigate('/assessments/blueprint');
    } else if (!hasCompletedFinancialData) {
      navigate('/assessments/currency');
    } else {
      navigate('/assessments/currency');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Hero Section - Always show */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-6">
          Welcome to Your Wealth
        </h1>
        <p className="text-xl text-gray-300 mb-4">
          Your journey to financial transformation starts here
        </p>
        <p className="text-lg text-primary-teal font-semibold">
          80% Psychology • 20% Mechanics
        </p>
      </div>

      {/* 80/20 Philosophy Section - Always show */}
      <div className="bg-dark-surface rounded-lg p-8 border border-dark-border mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          The 80/20 Philosophy
        </h2>
        <p className="text-gray-300 mb-4">
          Success in any area of life is primarily psychological. Before we dive into
          the mechanics of financial planning, we'll help you build the mental
          foundation for lasting wealth.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-dark-bg p-4 rounded border border-dark-border">
            <h3 className="text-lg font-semibold text-primary-teal mb-2">
              80% Psychology
            </h3>
            <p className="text-gray-400 text-sm">
              Mindset, beliefs, emotional patterns, and behavioral change
            </p>
          </div>
          <div className="bg-dark-bg p-4 rounded border border-dark-border">
            <h3 className="text-lg font-semibold text-primary-purple mb-2">
              20% Mechanics
            </h3>
            <p className="text-gray-400 text-sm">
              Financial strategies, investment vehicles, and planning tools
            </p>
          </div>
        </div>
      </div>

      {/* Your Journey Section - Always show */}
      <div className="bg-dark-surface rounded-lg p-8 border border-dark-border mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Your Journey Ahead
        </h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-teal rounded-full flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Psychology & Mindset Assessment
              </h3>
              <p className="text-gray-400 text-sm">
                Discover your money story and transform limiting beliefs
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-purple rounded-full flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Financial Blueprint Assessment
              </h3>
              <p className="text-gray-400 text-sm">
                Understand your current financial situation across 4 key areas
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-primary-pink rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Create Your Financial Plan
              </h3>
              <p className="text-gray-400 text-sm">
                Generate personalized scenarios and track your progress
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section - Show when training complete */}
      {hasCompletedTraining && (
        <div className="bg-gradient-to-r from-primary-teal/20 to-primary-purple/20 border border-primary-teal/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-teal rounded-full flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Psychology Assessment Complete!</h2>
              <p className="text-gray-400 text-sm">Mindset Score: {getMindsetScore()}%</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/psychology/results')}
              className="flex-1 px-4 py-2 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal/10 transition-colors text-sm font-semibold"
            >
              Review Results
            </button>
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-lg border border-dark-border text-gray-400 hover:text-white transition-colors text-sm"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Blueprint Results - Show when complete */}
      {hasCompletedAssessment && (
        <div className="bg-gradient-to-r from-primary-teal/20 to-primary-purple/20 border border-primary-teal/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-purple rounded-full flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Blueprint Assessment Complete!</h2>
              <p className="text-gray-400 text-sm">
                Scores: Psych {getBlueprintScores()?.psychologyScore}/10 • Econ {getBlueprintScores()?.economicsScore}/10
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/assessments/blueprint')}
              className="flex-1 px-4 py-2 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal/10 transition-colors text-sm font-semibold"
            >
              Review Results
            </button>
            <button
              onClick={handleRetakeBlueprint}
              className="px-4 py-2 rounded-lg border border-dark-border text-gray-400 hover:text-white transition-colors text-sm"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Financial Plan Results - Show when complete */}
      {hasCompletedFinancialData && financialData && (
        <div className="bg-gradient-to-r from-primary-teal/20 to-primary-purple/20 border border-primary-pink/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-pink rounded-full flex items-center justify-center">
              <span className="text-xl">✓</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Financial Plan Complete!</h2>
              <p className="text-gray-400 text-sm">
                Annual Income: {currencySymbol}{financialData.annualIncome.toLocaleString()} •
                Savings Rate: {(financialData.savingsRate * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/assessments/currency')}
              className="flex-1 px-4 py-2 rounded-lg border border-primary-pink text-primary-pink hover:bg-primary-pink/10 transition-colors text-sm font-semibold"
            >
              Review Financial Plan
            </button>
            <button
              onClick={() => {
                setRetakeType('financial');
                setShowRetakeWarning(true);
              }}
              className="px-4 py-2 rounded-lg border border-dark-border text-gray-400 hover:text-white transition-colors text-sm"
            >
              Retake
            </button>
          </div>
        </div>
      )}

      {/* Results Dashboard Link - Show when any assessment complete */}
      {(hasCompletedTraining || hasCompletedAssessment || hasCompletedFinancialData) && (
        <div className="bg-gradient-to-r from-primary-teal/10 to-primary-purple/10 border border-primary-teal/20 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-teal rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">View Your Complete Results</h2>
                <p className="text-gray-400 text-sm">
                  See all your scores, recommendations, and what needs work
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/results')}
              className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
            >
              Results Dashboard →
            </button>
          </div>
        </div>
      )}

      {/* Privacy Section - Always show */}
      <div className="bg-dark-surface rounded-lg p-8 border border-dark-border mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">
          Privacy First
        </h2>
        <p className="text-gray-300 mb-4">
          All your data is stored locally in your browser. You're in complete control
          of your financial information. Export your data anytime as a backup or to
          migrate to our full platform later.
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v7h8z" />
          </svg>
          <span>No account required</span>
          <span className="text-gray-600">•</span>
          <span>Data never leaves your browser</span>
          <span className="text-gray-600">•</span>
          <span>Export anytime</span>
        </div>
      </div>

      {/* Data Management - Always show */}
      <DataManagement />

      {/* Main CTA Button */}
      <div className="mt-8 text-center">
        {/* Show dual path when no training is complete */}
        {!hasCompletedTraining ? (
          <div className="space-y-4">
            <button
              onClick={handleStartTraining}
              className="w-full bg-primary-teal hover:bg-teal-600 text-white font-bold py-4 px-12 rounded-lg transition-colors text-lg"
            >
              Start Training (Recommended)
            </button>
            <div className="relative">
              <button
                onClick={handleSkipToAssessments}
                className="text-gray-400 hover:text-primary-teal text-sm underline transition-colors"
                title="Already have financial knowledge? Jump straight in"
              >
                Skip to Assessments
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Comprehensive training • 20-30 min
            </p>
          </div>
        ) : (
          <div>
            <button
              onClick={handleContinue}
              className="bg-primary-teal hover:bg-teal-600 text-white font-bold py-4 px-12 rounded-lg transition-colors text-lg"
            >
              {getContinueLabel()}
            </button>
            <p className="text-gray-400 text-sm mt-4">
              {hasCompletedTraining && !hasCompletedAssessment && 'Assess your current financial situation'}
              {hasCompletedAssessment && !hasCompletedFinancialData && 'Enter your financial data'}
              {hasCompletedFinancialData && 'View and adjust your personalized projections'}
            </p>
          </div>
        )}

        {/* Retake Warning Modal */}
        {showRetakeWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
            <div className="bg-dark-surface border-2 border-red-400 rounded-lg p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                {retakeType === 'psychology' && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Reset Psychology Assessment?</h3>
                    <p className="text-gray-300">
                      This will permanently delete all your psychology assessment progress.
                    </p>
                  </>
                )}
                {retakeType === 'blueprint' && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Retake Blueprint Assessment?</h3>
                    <p className="text-gray-300">
                      This will permanently delete your blueprint assessment responses and scores.
                    </p>
                  </>
                )}
                {retakeType === 'financial' && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-2">Clear Financial Data?</h3>
                    <p className="text-gray-300">
                      This will permanently delete all your financial information.
                    </p>
                  </>
                )}
              </div>

              {retakeType === 'financial' && (
                <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-6">
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Annual income and projections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Assets (retirement, cash, investments, property)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Liabilities and debts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Monthly expense breakdown</span>
                    </li>
                  </ul>
                </div>
              )}

              {retakeType === 'psychology' && (
                <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-6">
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Mindset assessment score and responses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Limiting beliefs identified</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Empowering beliefs installed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Action commitments and deadlines</span>
                    </li>
                  </ul>
                </div>
              )}

              {retakeType === 'blueprint' && (
                <div className="bg-red-400/10 border border-red-400/30 rounded-lg p-4 mb-6">
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Assessment responses (40 questions)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Category scores (Psychology, Economics, Sophistication, Execution)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">•</span>
                      <span>Overall blueprint score</span>
                    </li>
                  </ul>
                </div>
              )}

              <p className="text-gray-400 text-sm mb-6 text-center">
                {retakeType === 'financial' && 'You will need to re-enter all your financial information from scratch.'}
                {retakeType === 'psychology' && 'You will need to complete all 7 training steps again.'}
                {retakeType === 'blueprint' && 'You will need to answer all 40 assessment questions again.'}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRetakeWarning(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowRetakeWarning(false);
                    if (retakeType === 'psychology') {
                      // Clear mindset responses from store and localStorage
                      clearMindsetResponses();
                      localStorage.removeItem('your-wealth-psychology');
                      navigate('/psychology/mindset-assessment');
                    } else if (retakeType === 'blueprint') {
                      // Clear blueprint assessment from store and localStorage
                      setBlueprintAssessment(null);
                      localStorage.removeItem('your-wealth-assessments');
                      navigate('/assessments/blueprint');
                    } else if (retakeType === 'financial') {
                      // Clear financial data from store and localStorage
                      setFinancialData(null);
                      localStorage.removeItem('your-wealth-financial-plan');
                      navigate('/assessments/currency');
                    }
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                >
                  {retakeType === 'psychology' && 'Reset Training'}
                  {retakeType === 'blueprint' && 'Retake Assessment'}
                  {retakeType === 'financial' && 'Clear Data & Retake'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Skip Training Warning Modal */}
        {showSkipWarning && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
            <div className="bg-dark-surface border-2 border-yellow-400 rounded-lg p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Skip Training?</h3>
                <p className="text-gray-300">
                  Training is designed to help you get the most accurate results and understand your financial blueprint.
                </p>
              </div>

              <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm mb-2">You'll skip:</p>
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Mindset & Psychology foundations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Financial fundamentals education</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    <span>Assessment best practices</span>
                  </li>
                </ul>
              </div>

              <p className="text-gray-400 text-sm mb-6 text-center">
                You can always return to the Training Center later from the home screen.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSkipWarning(false)}
                  className="flex-1 px-4 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
                >
                  I'll Take Training First
                </button>
                <button
                  onClick={() => {
                    setShowSkipWarning(false);
                    navigate('/psychology/mindset-assessment');
                  }}
                  className="flex-1 px-4 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
                >
                  Yes, Skip to Assessments
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

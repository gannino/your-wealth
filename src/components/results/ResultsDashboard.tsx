import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore, useAssessmentStore, useFinancialPlanStore } from '../../stores';
import { calculateUKFIRE } from '../../lib/calculations/uk-fire';
import type { UKFIREResult } from '../../types';

interface ScoreCard {
  title: string;
  score: number | null;
  maxScore: number;
  color: string;
  status: 'Excellent' | 'Good' | 'Needs Work' | 'Not Started' | 'Complete' | 'On Track' | 'Good Progress';
  recommendation: string;
  action: string;
  route: string;
}

export default function ResultsDashboard() {
  const navigate = useNavigate();
  const { getMindsetScore, stepsCompleted } = usePsychologyStore();
  const { getBlueprintScores } = useAssessmentStore();
  const { financialData, isUKMode, ukSpending, ukAssets, ukDebts, ukGoals } = useFinancialPlanStore();
  const [fireResult, setFireResult] = useState<UKFIREResult | null>(null);

  const mindsetScore = getMindsetScore();
  const blueprintScores = getBlueprintScores();

  // Calculate UK FIRE results if in UK mode
  useEffect(() => {
    if (isUKMode) {
      console.log('ResultsDashboard: UK mode detected, loading FIRE results...');

      // First try to get results from session storage (set by UKFIREInsights)
      const storedResults = sessionStorage.getItem('ukFireResults');
      const timestamp = sessionStorage.getItem('ukFireTimestamp');

      console.log('Session storage check:', {
        hasResults: !!storedResults,
        hasTimestamp: !!timestamp,
        timestamp: timestamp ? new Date(parseInt(timestamp)).toISOString() : 'none'
      });

      if (storedResults) {
        try {
          const parsed = JSON.parse(storedResults);
          console.log('Successfully loaded FIRE results from session storage:', parsed);
          setFireResult(parsed);
          return;
        } catch (e) {
          console.error('Error parsing stored FIRE results:', e);
          // Clear invalid data
          sessionStorage.removeItem('ukFireResults');
          sessionStorage.removeItem('ukFireTimestamp');
        }
      }

      // Fall back to calculating from store data
      console.log('No session storage found, calculating from store data...');
      console.log('Store data check:', {
        hasSpending: !!ukSpending,
        hasAssets: !!ukAssets,
        hasDebts: !!ukDebts,
        hasGoals: !!ukGoals
      });

      if (ukSpending && ukAssets && ukDebts && ukGoals) {
        const monthlyIncome = 4000; // Default, would be captured in interview
        const result = calculateUKFIRE(
          35, // Default age, would be captured in interview
          monthlyIncome,
          ukSpending,
          ukAssets,
          ukDebts,
          ukGoals,
          monthlyIncome - Object.values(ukSpending).reduce((sum, cat) => sum + cat.monthly_gbp, 0),
          0.05
        );
        console.log('Calculated FIRE results from store:', result);
        setFireResult(result);
      } else {
        console.log('Cannot calculate FIRE results - missing store data');
      }
    }
  }, [isUKMode, ukSpending, ukAssets, ukDebts, ukGoals]);

  const getScoreStatus = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Good';
    return 'Needs Work';
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Simplified to 3 main summary cards + UK FIRE card if in UK mode
  const baseScoreCards: ScoreCard[] = [
    {
      title: 'Mindset & Psychology',
      score: stepsCompleted.includes(2) ? mindsetScore : null,
      maxScore: 100,
      color: stepsCompleted.includes(2) ? getScoreColor(mindsetScore, 100) : 'text-gray-400',
      status: stepsCompleted.includes(2) ? getScoreStatus(mindsetScore, 100) : 'Not Started',
      recommendation: stepsCompleted.includes(2)
        ? 'Your money beliefs and psychology assessment results are available.'
        : 'Complete the Mindset Assessment to identify your money beliefs.',
      action: stepsCompleted.includes(2) ? 'View Full Results' : 'Take Assessment',
      route: stepsCompleted.includes(2) ? '/psychology/results' : '/training/mindset',
    },
    {
      title: 'Financial Blueprint',
      score: blueprintScores ? Math.round((blueprintScores!.psychologyScore + blueprintScores!.economicsScore + blueprintScores!.sophisticationScore + blueprintScores!.executionScore) / 4) : null,
      maxScore: 10,
      color: blueprintScores ? getScoreColor(
        Math.round((blueprintScores!.psychologyScore + blueprintScores!.economicsScore + blueprintScores!.sophisticationScore + blueprintScores!.executionScore) / 4), 10
      ) : 'text-gray-400',
      status: blueprintScores !== null && blueprintScores !== undefined
        ? getScoreStatus(
            Math.round((blueprintScores!.psychologyScore + blueprintScores!.economicsScore + blueprintScores!.sophisticationScore + blueprintScores!.executionScore) / 4), 10
          )
        : 'Not Started',
      recommendation: blueprintScores
        ? 'Your financial blueprint assessment reveals strengths and areas for improvement across 4 key areas.'
        : 'Complete the Blueprint Assessment to evaluate your financial knowledge and habits.',
      action: blueprintScores !== null && blueprintScores !== undefined ? 'View Detailed Breakdown' : 'Take Assessment',
      route: blueprintScores !== null && blueprintScores !== undefined ? '/assessments/blueprint' : '/assessments/blueprint',
    },
  ];

  // Add UK FIRE card for UK users
  const ukFireCard: ScoreCard = {
    title: 'Financial Independence',
    score: fireResult ? fireResult.projectedFIAge : null,
    maxScore: 65, // Typical retirement age benchmark
    color: fireResult && fireResult.projectedFIAge <= 50 ? 'text-green-400' : fireResult && fireResult.projectedFIAge <= 55 ? 'text-yellow-400' : 'text-gray-400',
    status: fireResult ? (fireResult.projectedFIAge <= 50 ? 'On Track' : fireResult.projectedFIAge <= 55 ? 'Good Progress' : 'Needs Work') : 'Not Started',
    recommendation: fireResult
      ? `Projected FI Age: ${fireResult.projectedFIAge} • Savings Rate: ${fireResult.savings_rate_percent}% • FIRE Number: £${(fireResult.fireNumber_gbp / 1000).toFixed(0)}k`
      : 'Complete the financial questionnaire to discover your path to financial independence.',
    action: fireResult ? 'View Your Financial Plan' : 'Enter Financial Data',
    route: fireResult ? '/planning/generate' : '/assessments/currency',
  };

  const financialPlanCard: ScoreCard = {
    title: 'Financial Plan',
    score: financialData ? 100 : null,
    maxScore: 100,
    color: financialData ? 'text-green-400' : 'text-gray-400',
    status: financialData ? 'Complete' : 'Not Started',
    recommendation: financialData
      ? 'Your personalized financial plan with projections and recommendations is ready.'
      : 'Select your currency and enter financial data to generate your personalized wealth plan.',
    action: financialData ? 'View Your Plan' : 'Enter Data',
    route: '/assessments/currency',
  };

  // Combine cards: UK users get FIRE card instead of Financial Plan card
  const scoreCards: ScoreCard[] = isUKMode
    ? [...baseScoreCards, ukFireCard]
    : [...baseScoreCards, financialPlanCard];

  // Priority focus: show blueprint breakdown if available
  const needsWork = scoreCards.filter(
    (card) => card.score !== null && card.status === 'Needs Work'
  ).sort((a, b) => (a.score! / a.maxScore) - (b.score! / b.maxScore));

  const notStarted = scoreCards.filter((card) => card.status === 'Not Started');

  const completedCount = scoreCards.filter((card) => card.score !== null).length;
  const totalCount = scoreCards.length;
  const overallProgress = Math.round((completedCount / totalCount) * 100);

  // Blueprint breakdown data
  const blueprintCategories = [
    { name: 'Psychology', score: blueprintScores?.psychologyScore, color: 'text-primary-pink' },
    { name: 'Economics', score: blueprintScores?.economicsScore, color: 'text-primary-purple' },
    { name: 'Investment', score: blueprintScores?.sophisticationScore, color: 'text-primary-teal' },
    { name: 'Execution', score: blueprintScores?.executionScore, color: 'text-primary-blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Your Financial Blueprint
          </h1>
          <p className="text-xl text-gray-300 mb-2">
            Comprehensive results and personalized recommendations
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-full max-w-md bg-dark-bg rounded-full h-3">
              <div
                className="bg-primary-teal h-3 rounded-full transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-primary-teal font-semibold">{overallProgress}% Complete</span>
          </div>
        </div>

        {/* Priority Section - What Needs Work */}
        {needsWork.length > 0 && (
          <div className="bg-gradient-to-r from-red-400/10 to-orange-400/10 border border-red-400/30 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-400/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Priority Areas</h2>
                <p className="text-gray-400 text-sm">Focus here first for biggest impact</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {needsWork.map((card, index) => (
                <div key={index} className="bg-dark-bg/50 border border-dark-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                    {card.score !== null && (
                      <span className={`text-xl font-bold ${card.color}`}>
                        {card.score}/{card.maxScore}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{card.recommendation}</p>
                  <button
                    onClick={() => navigate(card.route)}
                    className="text-primary-teal hover:text-teal-300 text-sm font-semibold underline"
                  >
                    {card.action} →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Not Started Section */}
        {notStarted.length > 0 && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-400/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Not Started</h2>
                <p className="text-gray-400 text-sm">Complete these to get your full picture</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {notStarted.map((card, index) => (
                <button
                  key={index}
                  onClick={() => navigate(card.route)}
                  className="bg-dark-bg border border-dark-border hover:border-primary-teal rounded-lg p-4 text-left transition-colors"
                >
                  <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
                  <p className="text-primary-teal text-sm font-semibold">
                    {card.action} →
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* UK FIRE Details Section - Only shown for UK users who completed FIRE interview */}
        {isUKMode && fireResult && (
          <div className="bg-gradient-to-r from-primary-purple/20 to-primary-teal/20 border border-primary-teal/30 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Your FIRE Potential 🔥</h2>
                <p className="text-gray-300 text-sm">Financial Independence, Retire Early analysis</p>
              </div>
              <button
                onClick={() => navigate('/planning/generate')}
                className="px-4 py-2 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white transition-colors text-sm font-semibold"
              >
                View Your Financial Plan →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Savings Rate</p>
                <p className={`text-4xl font-bold ${fireResult.savings_rate_percent >= 20 ? 'text-green-400' : fireResult.savings_rate_percent >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {fireResult.savings_rate_percent}%
                </p>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">Savings Leak</p>
                <p className="text-4xl font-bold text-primary-teal">
                  £{fireResult.leak_gbp_per_month.toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs mt-1">per month</p>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">FIRE Number</p>
                <p className="text-4xl font-bold text-white">
                  £{(fireResult.fireNumber_gbp / 1000).toFixed(0)}k
                </p>
              </div>
              <div className="bg-dark-bg/50 rounded-lg p-4 text-center">
                <p className="text-gray-400 text-sm mb-2">FI Age</p>
                <p className={`text-4xl font-bold ${fireResult.projectedFIAge <= (ukGoals?.targetRetirementAge || 55) ? 'text-green-400' : 'text-yellow-400'}`}>
                  {fireResult.projectedFIAge}
                </p>
                <p className="text-gray-500 text-xs mt-1">years old</p>
              </div>
            </div>

            {/* Three Actions */}
            <div className="bg-dark-bg/30 border border-dark-border rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Your Three Actions</h3>
              <div className="space-y-2">
                {fireResult.threeActions.map((action, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary-teal rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-200 text-sm flex-1">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lever Scenarios */}
            <div className="bg-dark-bg/30 border border-dark-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-3">What-If Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fireResult.leverScenarios.map((scenario, index) => (
                  <div key={index} className="bg-dark-bg/50 rounded-lg p-3">
                    <p className="text-white text-sm font-medium mb-1">{scenario.description}</p>
                    <p className="text-2xl font-bold text-primary-teal">
                      Age {scenario.projectedFIAge}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {scenario.projectedFIAge < fireResult.projectedFIAge ?
                        `${fireResult.projectedFIAge - scenario.projectedFIAge} years sooner` :
                        'Same timeline'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Blueprint Breakdown Summary */}
        {blueprintScores && (
          <div className="bg-dark-surface border border-dark-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Blueprint Assessment Breakdown</h2>
                <p className="text-gray-400 text-sm">Your scores across 4 key financial areas</p>
              </div>
              <button
                onClick={() => navigate('/assessments/blueprint')}
                className="px-4 py-2 rounded-lg border border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white transition-colors text-sm font-semibold"
              >
                View Full Details →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {blueprintCategories.map((cat, idx) => (
                <div key={idx} className="bg-dark-bg rounded-lg p-4 text-center">
                  <p className="text-gray-400 text-sm mb-2">{cat.name}</p>
                  <p className={`text-3xl font-bold ${cat.score !== undefined ? getScoreColor(cat.score, 10) : 'text-gray-500'}`}>
                    {cat.score !== null ? cat.score : '--'}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">/ 10</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Score Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {scoreCards.map((card, index) => (
            <div
              key={index}
              className={`bg-dark-surface border-2 rounded-lg p-6 transition-all ${
                card.status === 'Needs Work'
                  ? 'border-red-400/50'
                  : card.status === 'Excellent' || card.status === 'Complete'
                  ? 'border-green-400/50'
                  : 'border-dark-border'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                  <span className={`text-sm font-semibold ${
                    card.status === 'Excellent' || card.status === 'Complete'
                      ? 'text-green-400'
                      : card.status === 'Good'
                      ? 'text-yellow-400'
                      : card.status === 'Needs Work'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`}>
                    {card.status}
                  </span>
                </div>
                {card.score !== null && (
                  <div className={`text-4xl font-bold ${card.color}`}>
                    {card.score}
                    <span className="text-lg text-gray-400">/{card.maxScore}</span>
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                {card.recommendation}
              </p>

              <button
                onClick={() => navigate(card.route)}
                className="w-full px-4 py-2 rounded-lg bg-primary-teal/10 border border-primary-teal text-primary-teal hover:bg-primary-teal hover:text-white transition-colors text-sm font-semibold"
              >
                {card.action} →
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <p className="text-gray-300">
              {completedCount === totalCount
                ? 'Great progress! Review your detailed results and continue building your financial future.'
                : `${totalCount - completedCount} area${totalCount - completedCount > 1 ? 's' : ''} remaining to complete your financial blueprint.`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/training/hub')}
                className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
              >
                Training Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

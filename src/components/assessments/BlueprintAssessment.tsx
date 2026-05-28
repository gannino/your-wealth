import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessmentStore } from '../../stores';

interface BlueprintQuestion {
  id: string;
  category: 'psychology' | 'economics' | 'sophistication' | 'execution';
  text: string;
  inverse?: boolean;
}

const blueprintQuestions: BlueprintQuestion[] = [
  // Psychology Questions (10)
  { id: 'p1', category: 'psychology', text: 'I feel anxious when thinking about money.' },
  { id: 'p2', category: 'psychology', text: 'I believe wealth is primarily about luck.' },
  { id: 'p3', category: 'psychology', text: 'I avoid looking at my bank account balance.' },
  { id: 'p4', category: 'psychology', text: 'I frequently compare my finances to others.' },
  { id: 'p5', category: 'psychology', text: 'I feel guilty when spending money on myself.' },
  { id: 'p6', category: 'psychology', text: 'I believe rich people are less happy.' },
  { id: 'p7', category: 'psychology', text: 'I worry about running out of money in retirement.' },
  { id: 'p8', category: 'psychology', text: 'I have clear financial goals written down.', inverse: true },
  { id: 'p9', category: 'psychology', text: 'I regularly review my finances.', inverse: true },
  { id: 'p10', category: 'psychology', text: 'I feel confident about my financial decisions.', inverse: true },

  // Economics Questions (10)
  { id: 'e1', category: 'economics', text: 'I understand the power of compound interest.', inverse: true },
  { id: 'e2', category: 'economics', text: 'I know my current net worth.', inverse: true },
  { id: 'e3', category: 'economics', text: 'I track my monthly expenses.', inverse: true },
  { id: 'e4', category: 'economics', text: 'I have a written budget.', inverse: true },
  { id: 'e5', category: 'economics', text: 'I know my tax rate.', inverse: true },
  { id: 'e6', category: 'economics', text: 'I understand inflation\'s impact on my savings.', inverse: true },
  { id: 'e7', category: 'economics', text: 'I have an emergency fund.', inverse: true },
  { id: 'e8', category: 'economics', text: 'I know how much I need to retire.', inverse: true },
  { id: 'e9', category: 'economics', text: 'I understand different investment types.', inverse: true },
  { id: 'e10', category: 'economics', text: 'I know my credit score.', inverse: true },

  // Sophistication Questions (10)
  { id: 's1', category: 'sophistication', text: 'I have a diversified investment portfolio.', inverse: true },
  { id: 's2', category: 'sophistication', text: 'I max out my tax-advantaged retirement accounts.', inverse: true },
  { id: 's3', category: 'sophistication', text: 'I understand asset allocation.', inverse: true },
  { id: 's4', category: 'sophistication', text: 'I rebalance my portfolio regularly.', inverse: true },
  { id: 's5', category: 'sophistication', text: 'I invest in low-cost index funds.', inverse: true },
  { id: 's6', category: 'sophistication', text: 'I understand the difference between active and passive investing.', inverse: true },
  { id: 's7', category: 'sophistication', text: 'I have a long-term investment strategy.', inverse: true },
  { id: 's8', category: 'sophistication', text: 'I don\'t panic during market downturns.', inverse: true },
  { id: 's9', category: 'sophistication', text: 'I understand fees and expense ratios.', inverse: true },
  { id: 's10', category: 'sophistication', text: 'I invest consistently regardless of market conditions.', inverse: true },

  // Execution Questions (10)
  { id: 'x1', category: 'execution', text: 'I automate my savings and investments.', inverse: true },
  { id: 'x2', category: 'execution', text: 'I pay myself first.', inverse: true },
  { id: 'x3', category: 'execution', text: 'I have automated bill payments.', inverse: true },
  { id: 'x4', category: 'execution', text: 'I review my accounts at least monthly.', inverse: true },
  { id: 'x5', category: 'execution', text: 'I have a financial advisor or trusted system.', inverse: true },
  { id: 'x6', category: 'execution', text: 'I take action on financial decisions promptly.', inverse: true },
  { id: 'x7', category: 'execution', text: 'I\'ve increased my income in the past year.', inverse: true },
  { id: 'x8', category: 'execution', text: 'I negotiate my bills and expenses.', inverse: true },
  { id: 'x9', category: 'execution', text: 'I have multiple streams of income.', inverse: true },
  { id: 'x10', category: 'execution', text: 'I regularly educate myself about finance.', inverse: true },
];

const categoryLabels = {
  psychology: 'Psychology & Mindset',
  economics: 'Economic Understanding',
  sophistication: 'Investment Sophistication',
  execution: 'Action & Execution',
};

// Explicit category order to guarantee consistent display
const CATEGORY_ORDER = ['psychology', 'economics', 'sophistication', 'execution'] as const;

export default function BlueprintAssessment() {
  const navigate = useNavigate();
  const { blueprintAssessment, setBlueprintAssessment } = useAssessmentStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const question = blueprintQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / blueprintQuestions.length) * 100;
  const categoryProgress = Math.floor((currentQuestion / blueprintQuestions.length) * 4);

  // Check if assessment was already completed
  useEffect(() => {
    if (blueprintAssessment) {
      // Load saved answers into state for display
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnswers(blueprintAssessment.responses);
      setShowResults(true);
    }
  }, [blueprintAssessment]);

  const handleAnswer = (value: number) => {
    // Store the value directly without adjustment
    const updatedAnswers = { ...answers, [question.id]: value };

    if (currentQuestion < blueprintQuestions.length - 1) {
      setAnswers(updatedAnswers);
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Last question - update answers and calculate results
      setAnswers(updatedAnswers);
      calculateResults(updatedAnswers);
    }
  };

  const calculateResults = (finalAnswers: Record<string, number>) => {
    // Only store responses and completion timestamp - scores calculated on-demand
    const assessmentData = {
      responses: finalAnswers,
      completedAt: new Date().toISOString(),
    };

    console.log('✅ Saving blueprint assessment responses:', assessmentData);

    setBlueprintAssessment(assessmentData);
    setShowResults(true);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigate('/psychology/action-commitment');
    }
  };

  const getCategoryScore = (category: string) => {
    const categoryQuestions = blueprintQuestions.filter((q) => q.category === category);
    if (categoryQuestions.length === 0) return 0;

    // Calculate score accounting for inverse questions (same logic as store)
    const sum = categoryQuestions.reduce((acc, q) => {
      const answer = answers[q.id];
      if (!answer) return acc;
      // For inverse questions: use as-is (higher is better)
      // For regular questions: invert (lower is better)
      const adjustedAnswer = q.inverse ? answer : (6 - answer);
      return acc + adjustedAnswer;
    }, 0);

    return Math.round((sum / categoryQuestions.length) * 2);
  };

  if (showResults) {
    // Get scores dynamically from responses
    const scores = useAssessmentStore.getState().getBlueprintScores();

    // Fallback to calculating from current answers if no saved assessment
    const psychologyScore = scores?.psychologyScore ?? getCategoryScore('psychology');
    const economicsScore = scores?.economicsScore ?? getCategoryScore('economics');
    const sophisticationScore = scores?.sophisticationScore ?? getCategoryScore('sophistication');
    const executionScore = scores?.executionScore ?? getCategoryScore('execution');
    const overallScore = scores?.overallScore ?? Math.round(
      ((psychologyScore + economicsScore + sophisticationScore + executionScore) / 4) * 10
    );

    console.log('📊 Displayed scores:', { psychologyScore, economicsScore, sophisticationScore, executionScore, overallScore });

    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
            <h1 className="text-3xl font-bold text-white mb-2">Your Financial Blueprint</h1>
            <p className="text-gray-400 mb-8">Your assessment results across 4 key areas</p>

            {/* Overall Score */}
            <div className="bg-gradient-to-r from-primary-teal/20 to-primary-purple/20 border border-primary-teal/30 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Overall Score</h2>
                  <p className="text-gray-300">Your financial fitness level</p>
                </div>
                <div className="text-6xl font-bold text-primary-teal">{overallScore}/100</div>
              </div>
            </div>

            {/* Category Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {Object.entries(categoryLabels).map(([key, label]) => {
                // Use saved scores from store instead of recalculating
                const scoreMap: Record<string, number> = {
                  psychology: psychologyScore,
                  economics: economicsScore,
                  sophistication: sophisticationScore,
                  execution: executionScore,
                };
                const score = scoreMap[key];
                const percentage = (score / 10) * 100;
                const color =
                  score >= 8
                    ? 'text-green-400'
                    : score >= 6
                    ? 'text-yellow-400'
                    : 'text-red-400';

                return (
                  <div key={key} className="bg-dark-bg border border-dark-border rounded-lg p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-semibold text-white">{label}</h3>
                      <span className={`text-2xl font-bold ${color}`}>{score}/10</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          score >= 8
                            ? 'bg-green-400'
                            : score >= 6
                            ? 'bg-yellow-400'
                            : 'bg-red-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Response Breakdown by Category */}
            <div className="space-y-8 mb-8">
              {CATEGORY_ORDER.map((category) => {
                const categoryQuestions = blueprintQuestions.filter(q => q.category === category);
                const categoryScore = getCategoryScore(category);
                const percentage = (categoryScore / 10) * 100;
                const color = categoryScore >= 8 ? 'text-green-400' : categoryScore >= 6 ? 'text-yellow-400' : 'text-red-400';
                const bgColor = categoryScore >= 8 ? 'bg-green-400/10 border-green-400/30' : categoryScore >= 6 ? 'bg-yellow-400/10 border-yellow-400/30' : 'bg-red-400/10 border-red-400/30';

                return (
                  <div key={category} className={`border-2 rounded-lg p-6 ${bgColor}`}>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{categoryLabels[category]}</h3>
                        <p className="text-gray-400">
                          {category === 'psychology' && 'Your money mindset and emotional relationship with finances'}
                          {category === 'economics' && 'Understanding of financial concepts and your current situation'}
                          {category === 'sophistication' && 'Knowledge of investing and portfolio management'}
                          {category === 'execution' && 'Ability to take consistent financial action'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-4xl font-bold ${color}`}>{categoryScore}/10</div>
                        <p className="text-gray-400 text-sm">
                          {categoryScore >= 8 ? 'Excellent' : categoryScore >= 6 ? 'Good' : 'Needs Work'}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-dark-bg rounded-full h-4 mb-6">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          categoryScore >= 8 ? 'bg-green-400' : categoryScore >= 6 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    {/* Individual Responses */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-white mb-4">Your Responses</h4>
                      {categoryQuestions.map((q) => {
                        const response = answers[q.id];
                        if (!response) return null;

                        // Determine if response is positive/empowering
                        // For inverse questions (positive statements): high scores = good
                        // For regular questions (negative statements): low scores = good
                        const adjustedScore = q.inverse ? response : (6 - response);
                        const isPositive = adjustedScore >= 4;
                        const answerLabel = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'][response - 1];

                        return (
                          <div
                            key={q.id}
                            className={`bg-dark-bg/50 border rounded-lg p-4 ${
                              isPositive ? 'border-green-400/30' : 'border-red-400/30'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1">
                                <p className="text-white font-medium mb-2">{q.text}</p>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-semibold ${
                                    isPositive ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {answerLabel}
                                  </span>
                                  {isPositive ? (
                                    <span className="text-green-400 text-sm">✓ Strength</span>
                                  ) : (
                                    <span className="text-red-400 text-sm">⚠️ Area to Improve</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Category-Specific Insights */}
                    <div className="mt-6 p-4 bg-dark-bg rounded-lg">
                      <h5 className="text-lg font-semibold text-primary-purple mb-3">💡 Key Insights</h5>
                      <ul className="space-y-2 text-gray-300 text-sm">
                        {category === 'psychology' && (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Your money psychology shapes every financial decision you make</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Emotional reactions to money often override logical thinking</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Improving mindset is the foundation of all financial success</span>
                            </li>
                          </>
                        )}
                        {category === 'economics' && (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Financial literacy is the prerequisite for smart decisions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Understanding your current situation is the first step to improvement</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>What gets measured gets managed - tracking is essential</span>
                            </li>
                          </>
                        )}
                        {category === 'sophistication' && (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Sophisticated investors understand diversification and long-term thinking</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Low-cost index funds outperform 80% of active managers</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Time in market beats timing the market - consistency is key</span>
                            </li>
                          </>
                        )}
                        {category === 'execution' && (
                          <>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Knowledge without action is just entertainment</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Automating finances removes willpower from the equation</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-primary-purple">→</span>
                              <span>Small consistent actions beat big occasional efforts</span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Overall Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Strengths */}
              <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">💪</span>
                  </div>
                  <h3 className="text-xl font-bold text-green-400">Your Strengths</h3>
                </div>
                <ul className="space-y-2">
                  {psychologyScore >= 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Strong money mindset and emotional control</span>
                    </li>
                  )}
                  {economicsScore >= 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Good understanding of financial fundamentals</span>
                    </li>
                  )}
                  {sophisticationScore >= 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Sophisticated investment knowledge and strategy</span>
                    </li>
                  )}
                  {executionScore >= 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-green-400">✓</span>
                      <span>Excellent execution and consistency with finances</span>
                    </li>
                  )}
                  {psychologyScore < 7 && economicsScore < 7 && sophisticationScore < 7 && executionScore < 7 && (
                    <li className="text-gray-400 italic">Complete assessments to discover your strengths</li>
                  )}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-400/20 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-orange-400">Priority Focus Areas</h3>
                </div>
                <ul className="space-y-2">
                  {psychologyScore < 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-orange-400">→</span>
                      <span>Work on transforming limiting money beliefs</span>
                    </li>
                  )}
                  {economicsScore < 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-orange-400">→</span>
                      <span>Build understanding of your financial situation</span>
                    </li>
                  )}
                  {sophisticationScore < 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-orange-400">→</span>
                      <span>Learn about diversified investing strategies</span>
                    </li>
                  )}
                  {executionScore < 7 && (
                    <li className="flex items-start gap-2 text-gray-300">
                      <span className="text-orange-400">→</span>
                      <span>Set up automated systems for consistent action</span>
                    </li>
                  )}
                  {psychologyScore >= 7 && economicsScore >= 7 && sophisticationScore >= 7 && executionScore >= 7 && (
                    <li className="text-gray-400 italic">Great job! Focus on maintaining and building on your strengths</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 mb-8">
              <h3 className="text-xl font-semibold text-primary-purple mb-4">Recommendations</h3>
              <ul className="space-y-3">
                {psychologyScore < 7 && (
                  <li className="flex items-start gap-3">
                    <span className="text-primary-purple">→</span>
                    <span className="text-gray-300">
                      Start with the psychology assessment to transform limiting beliefs
                    </span>
                  </li>
                )}
                {economicsScore < 7 && (
                  <li className="flex items-start gap-3">
                    <span className="text-primary-purple">→</span>
                    <span className="text-gray-300">
                      Focus on understanding your current financial situation
                    </span>
                  </li>
                )}
                {sophisticationScore < 7 && (
                  <li className="flex items-start gap-3">
                    <span className="text-primary-purple">→</span>
                    <span className="text-gray-300">
                      Learn about diversified investing and asset allocation
                    </span>
                  </li>
                )}
                {executionScore < 7 && (
                  <li className="flex items-start gap-3">
                    <span className="text-primary-purple">→</span>
                    <span className="text-gray-300">
                      Set up automatic savings and investment systems
                    </span>
                  </li>
                )}
                {psychologyScore >= 7 && economicsScore >= 7 && sophisticationScore >= 7 && executionScore >= 7 && (
                  <li className="flex items-start gap-3">
                    <span className="text-primary-purple">✓</span>
                    <span className="text-gray-300">
                      You have a solid foundation! Proceed to financial planning
                    </span>
                  </li>
                )}
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/assessments/currency')}
                className="flex-1 bg-primary-teal hover:bg-primary-teal/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continue to Financial Data →
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-primary-teal hover:text-white transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>
                Question {currentQuestion + 1} of {blueprintQuestions.length}
              </span>
              <span>{categoryLabels[question.category]}</span>
            </div>
            <div className="w-full bg-dark-bg rounded-full h-2 mb-2">
              <div
                className="bg-primary-teal h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-1 rounded-full ${
                    i < categoryProgress ? 'bg-primary-teal' : 'bg-dark-border'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question */}
          <button
            onClick={handleBack}
            className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-2"
          >
            ← Back
          </button>

          <h1 className="text-2xl font-bold text-white mb-8">{question.text}</h1>

          {/* Answer Options */}
          <div className="space-y-3">
            {[
              { value: 1, label: 'Strongly Disagree' },
              { value: 2, label: 'Disagree' },
              { value: 3, label: 'Neutral' },
              { value: 4, label: 'Agree' },
              { value: 5, label: 'Strongly Agree' },
            ].map((option) => (
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

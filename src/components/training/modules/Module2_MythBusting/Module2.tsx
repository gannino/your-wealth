/**
 * Module 2: Myth-Busting
 *
 * Shatters the 9 financial myths that destroy wealth.
 * Covers hidden fees, the Fee Destruction Formula, and the power of index funds.
 */

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../../../stores/trainingStore';
import { createSanitizedMarkup } from '../../../../lib/utils/sanitizeHtml';
import { ReflectionScreen } from '../../shared/ReflectionScreen';
import type { ScreenContent, QuizOption } from '../types';

const MODULE_2_SCREENS: ScreenContent[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Welcome to Module 2: Myth-Busting',
    subtitle: 'Shatter the 9 Financial Myths That Destroy Wealth',
    content: `
      <p class="text-xl mb-6">Welcome to <strong>Module 2: Myth-Busting</strong> — where you'll discover the financial half-truths that destroy wealth.</p>

      <p class="mb-4">The financial industry thrives on complexity and confusion. By the time you finish this module, you'll see through the myths that cost investors trillions.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">What You'll Learn:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The nine financial myths that destroy wealth</li>
          <li>How hidden fees secretly eat your returns</li>
          <li>The Fee Destruction Formula that will shock you</li>
          <li>Why index funds consistently beat active managers</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6">
        <h3 class="text-white text-lg font-bold mb-2">⏱️ Time Investment</h3>
        <p class="text-gray-400">Approximately 15-20 minutes to complete this module</p>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-purple text-xl font-bold mb-3">💡 The Shocking Truth</h3>
        <p class="text-gray-200 mb-4">Did you know that a 2% fee can cost you <strong>65% of your wealth</strong> over 40 years? That's not a typo — and most investors never see it coming.</p>
        <p class="text-gray-200">In this module, you'll learn exactly how to spot and avoid these wealth-destroying traps.</p>
      </div>

      <p class="text-gray-400 italic mt-6">Ready to separate fact from fiction? Let's bust some myths.</p>
    `,
    meta: { duration: '15-20 min' }
  },
  {
    id: 'myth-1-3',
    type: 'content',
    title: 'Myths 1-3: Complexity, Conflicts, and Fees',
    subtitle: 'The most dangerous myths destroy wealth silently',
    content: `
      <p class="text-lg mb-6">Let's start with the first three myths — the ones that create the foundation for financial confusion.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #1: "Investing is complicated"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> The most successful investing strategy is simple: buy low-cost index funds and hold them.</p>
        <p class="text-gray-300 mb-4">Wall Street wants you to believe investing is complex so you'll pay for "expert" help. But the data is clear: over 10 years, <strong>80% of active fund managers underperform</strong> their benchmark index.</p>
        <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: You don't need to pick stocks. You don't need to time the market. You need a simple, diversified portfolio of low-cost index funds.</p>
        </div>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #2: "Advisors are fiduciaries"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Most "financial advisors" are actually brokers — salespeople with a legal obligation to their employer's profits, not to you.</p>
        <p class="text-gray-300 mb-4">A fiduciary must act in your best interest. A broker only needs to recommend "suitable" products — which conveniently pay them the highest commissions.</p>
        <div class="bg-red-400/10 border-l-4 border-red-400 p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: Ask "Are you a fiduciary?" If they say anything other than "Yes, always," walk away.</p>
        </div>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #3: "Fees don't matter"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Fees are the single biggest predictor of your investment returns — and they're the only thing you can control.</p>
        <p class="text-gray-300 mb-4">A 1% difference in fees doesn't sound like much. But compounded over decades, that 1% can consume <strong>30-50% of your wealth</strong>.</p>
        <div class="bg-primary-purple/10 border-l-4 border-primary-purple p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: You can't control market returns. You CAN control fees. Lower fees = higher guaranteed returns.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'myth-quiz-1',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of the first three myths',
    content: `
      <p class="text-lg mb-6">Let's check your understanding of the myths we've covered so far.</p>
    `,
    question: 'What percentage of active fund managers underperform their benchmark over 10 years?',
    options: [
      { value: 'a', label: '20% - Most pros beat the market', feedback: 'Incorrect! This is what Wall Street wants you to believe. The reality is much worse.', isCorrect: false },
      { value: 'b', label: '50% - About half beat the market', feedback: 'Incorrect! You might think it\'s 50/50, but the data shows active management consistently fails.', isCorrect: false },
      { value: 'c', label: '80% - Most pros underperform', feedback: 'Correct! 80% of active fund managers fail to beat their benchmark over 10 years. This is why index funds win.', isCorrect: true },
      { value: 'd', label: '95% - Almost no one beats the market', feedback: 'Close but not quite! While active management performs poorly, the actual number is around 80%.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'myth-4-6',
    type: 'content',
    title: 'Myths 4-6: Performance, Service, and Target Date Funds',
    subtitle: 'Myths that hide in plain sight',
    content: `
      <p class="text-lg mb-6">Now let's examine the next three myths — ones that even experienced investors often believe.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #4: "My fund beat the market"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Past performance has ZERO correlation with future returns. None.</p>
        <p class="text-gray-300 mb-4">Funds advertise their winners and hide their losers. A fund that beat the market last year has no better odds of beating it this year than a coin flip.</p>
        <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: The hottest fund this year is statistically likely to be among the worst performers next year. Momentum reverses.</p>
        </div>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #5: "High fees = better service"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> High fees pay for marketing, not performance or service.</p>
        <p class="text-gray-300 mb-4">You're not getting "better advice" — you're funding TV commercials, glossy brochures, and sales commissions. The best investment advice is simple and doesn't cost 2%.</p>
        <div class="bg-primary-purple/10 border-l-4 border-primary-purple p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: The most expensive funds are usually the worst performers. High fees create a hurdle the fund can't overcome.</p>
        </div>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #6: "Target date funds are safe"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Target date funds often charge high fees (0.75%+) and use one-size-fits-all allocations that may not match your needs.</p>
        <p class="text-gray-300 mb-4">They seem convenient — "set it and forget it." But you're paying a premium for automation you could do yourself for pennies.</p>
        <div class="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: Target date funds are better than nothing, but building your own three-fund portfolio costs 1/10th the fees.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'myth-quiz-2',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of myths 4-6',
    content: `
      <p class="text-lg mb-6">Another quick check on what you've learned.</p>
    `,
    question: 'Why is past performance NOT a good predictor of future returns?',
    options: [
      { value: 'a', label: 'Markets change too unpredictably', feedback: 'Partially true, but there\'s a more specific reason related to how funds work.', isCorrect: false },
      { value: 'b', label: 'Fund managers rotate frequently', feedback: 'This happens, but even with the same manager, past performance doesn\'t predict future results.', isCorrect: false },
      { value: 'c', label: 'Winning funds attract too much money, making it harder to repeat', feedback: 'Correct! When a fund gets hot, money floods in. More money = harder to find good investments = performance reverts to mean.', isCorrect: true },
      { value: 'd', label: 'Past performance data is often faked', feedback: 'While some data is misleading, the real issue is that winning strategies stop working when everyone piles in.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'myth-7-9',
    type: 'content',
    title: 'Myths 7-9: Annuities, Timing, and Bear Markets',
    subtitle: 'The final three myths that can destroy your wealth',
    content: `
      <p class="text-lg mb-6">We've covered the most common myths. Now let's tackle three final ones that can have devastating consequences.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #7: "Annuities guarantee lifetime income"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Annuities guarantee income in nominal dollars — but inflation can destroy your purchasing power.</p>
        <p class="text-gray-300 mb-4">A $2,000 monthly annuity payment looks great today. At 3% inflation over 20 years, that $2,000 will only have the purchasing power of $1,100. Meanwhile, the insurance company keeps 2-3% in fees every year.</p>
        <div class="bg-red-400/10 border-l-4 border-red-400 p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: Annuities can make sense for some, but understand the fees and inflation risk. A simple bond ladder may offer better protection.</p>
        </div>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #8: "You can time the market"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Even professional traders with billions in resources cannot consistently time market entries and exits.</p>
        <p class="text-gray-300 mb-4">To successfully time the market, you need to be right twice: when to sell AND when to buy back. Get either wrong and you lose. Miss just the 10 best days in the market over 20 years and your returns drop by 50%.</p>
        <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: Time IN the market beats timing the market. Stay invested. The best days often come right after the worst drops.</p>
        </div>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-2xl font-bold text-white mb-4">Myth #9: "Bear markets are dangerous"</h2>
        <p class="text-gray-300 mb-4"><strong>Reality:</strong> Bear markets are buying opportunities for long-term investors.</p>
        <p class="text-gray-300 mb-4">Every single bear market in history has been followed by a recovery to new all-time highs. The investors who get hurt are those who sell at the bottom. The investors who build wealth are those who keep buying through the downturn.</p>
        <div class="bg-green-400/10 border-l-4 border-green-400 p-4 my-4 rounded-r-lg">
          <p class="text-white font-semibold">The Truth: Bear markets are the universe offering you a discount. When prices fall 30%, you get 30% more shares for the same money.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'fee-destruction',
    type: 'content',
    title: 'The Fee Destruction Formula',
    subtitle: 'See exactly how fees eat your wealth',
    content: `
      <p class="text-lg mb-6">You've heard that fees matter. Now let's see the math — because numbers don't lie.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Scenario:</h2>
      <p class="text-gray-300 mb-6">You invest $100,000. You earn a 7% return annually (historical stock market average). You invest for 40 years. We'll compare three fee levels.</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div class="bg-green-400/10 border border-green-400/30 rounded-lg p-6 text-center">
          <h3 class="text-green-400 font-bold text-lg mb-2">0.1% Fee (Index Fund)</h3>
          <p class="text-4xl font-bold text-white mb-2">$1,497,000</p>
          <p class="text-gray-400 text-sm">Final Wealth</p>
        </div>
        <div class="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6 text-center">
          <h3 class="text-yellow-400 font-bold text-lg mb-2">1% Fee (Typical Fund)</h3>
          <p class="text-4xl font-bold text-white mb-2">$1,075,000</p>
          <p class="text-gray-400 text-sm">Final Wealth</p>
          <p class="text-red-400 font-semibold mt-2">-$422,000 lost!</p>
        </div>
        <div class="bg-red-400/10 border border-red-400/30 rounded-lg p-6 text-center">
          <h3 class="text-red-400 font-bold text-lg mb-2">2% Fee (High-Fee Fund)</h3>
          <p class="text-4xl font-bold text-white mb-2">$747,000</p>
          <p class="text-gray-400 text-sm">Final Wealth</p>
          <p class="text-red-400 font-semibold mt-2">-$750,000 lost!</p>
        </div>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-purple text-xl font-bold mb-3">The Mind-Blowing Conclusion:</h3>
        <p class="text-gray-200 mb-4">A 1% fee difference cost you <strong>$422,000</strong>. That's nearly <strong>40% of your potential wealth</strong> — gone to fees.</p>
        <p class="text-gray-200">A 2% fee cost you <strong>$750,000</strong>. That's <strong>HALF of your wealth</strong> — transferred from your retirement to the financial industry.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Formula:</h2>
      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <p class="text-gray-300 font-mono text-lg mb-4">Final Amount = Principal × (1 + Return - Fee)^Years</p>
        <p class="text-gray-400">Small differences in the "Fee" part compound massively over 40 years.</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">Your Action Step:</h3>
        <p class="text-gray-200">Check your 401(k) and investment accounts. What fees are you paying? If you don't know, find out. Every 0.1% you save adds up to hundreds of thousands over your lifetime.</p>
      </div>
    `
  },
  {
    id: 'index-scenario',
    type: 'scenario',
    title: 'Real-World Decision',
    subtitle: 'Apply what you\'ve learned',
    scenario: `You're reviewing your 401(k) options. You're 35 years old and plan to retire at 70. You have $50,000 to invest.

Option A: Target Date 2055 Fund
- Expense ratio: 0.75%
- Automatically adjusts allocation as you age
- "Set it and forget it" convenience

Option B: S&P 500 Index Fund
- Expense ratio: 0.05%
- 100% stocks (you'd manage allocation yourself)
- Requires occasional rebalancing

The difference in fees is 0.70% per year.`,
    question: 'Which option do you choose?',
    options: [
      { value: 'target', label: 'Choose Target Date Fund (convenience is worth it)', feedback: 'Understandable, but expensive. That 0.70% fee difference could cost you over $200,000 in lost returns by retirement. Learning basic rebalancing once could save you a fortune.', isCorrect: false },
      { value: 'index', label: 'Choose S&P 500 Index Fund (keep more of your money)', feedback: 'Wise choice! The 0.70% fee difference compounds massively. Over 35 years, you could have $200,000+ more simply by avoiding high fees. Rebalancing once a year takes 10 minutes.', isCorrect: true },
      { value: 'split', label: 'Split 50/50 between both', feedback: 'Not terrible, but half your money still suffers high fees. Consider 100% low-cost index funds to maximize your wealth.', isCorrect: false },
    ],
    correctAnswer: 'index',
  },
  {
    id: 'reflection',
    type: 'reflection',
    title: 'Personal Reflection',
    subtitle: 'Take action on what you\'ve learned',
    content: `
      <p class="text-lg mb-6">You've learned how fees and myths destroy wealth. Now let's apply this to YOUR situation.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Reflect on These Questions:</h2>

      <div class="space-y-4 mb-6">
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">1. Fee Audit</h3>
          <p class="text-gray-300">What are the expense ratios of your current investments? (Check your 401(k), IRA, and any brokerage accounts)</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">2. Myth Check</h3>
          <p class="text-gray-300">Which of the 9 myths did you believe before this module? How has your thinking changed?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">3. Action Plan</h3>
          <p class="text-gray-300">What specific action will you take in the next 30 days? (Check fees, switch to low-cost funds, ask your advisor if they're a fiduciary)</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Your Reflection:</h2>
      <p class="text-gray-300 mb-4">Write down your commitment to yourself:</p>
    `,
  },
  {
    id: 'complete',
    type: 'content',
    title: 'Module 2 Complete!',
    subtitle: 'You\'re now armed with the truth',
    content: `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-primary-teal mb-4">Congratulations!</h2>
        <p class="text-xl text-gray-200">You've completed Module 2: Myth-Busting</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">Key Takeaways:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>You know the 9 financial myths that destroy wealth</li>
          <li>You understand how fees silently erode your returns</li>
          <li>You've seen the Fee Destruction Formula in action</li>
          <li>You know low-cost index funds outperform most active managers</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-xl font-bold text-white mb-4">What's Next:</h3>
        <p class="text-gray-300 mb-4">You've busted the myths. Now it's time to learn the strategy that builds real wealth.</p>

        <p class="text-gray-300 mb-4">In <strong>Module 3: Strategy</strong>, you'll discover:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-400">
          <li>The Three-Bucket system for balancing security and growth</li>
          <li>Ray Dalio's Core Four: All Seasons portfolio</li>
          <li>How to rebalance your portfolio automatically</li>
          <li>The power of uncorrelated assets</li>
        </ul>
      </div>

      <div class="text-center mt-8">
        <p class="text-gray-400 italic">Your progress has been saved. Continue your journey to financial mastery!</p>
      </div>
    `,
  },
];

function getScreenContent(screen: ScreenContent): string {
  const defaults: Record<string, string> = {
    'intro': screen.content || '',
    'complete': screen.content || '',
  };
  return defaults[screen.id] || screen.content || '';
}

export default function Module2_MythBusting() {
  const navigate = useNavigate();
  const { startModule, recordScreenProgress, completeModule, saveReflection, reflections } = useTrainingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reflectionResponse, setReflectionResponse] = useState('');

  const currentScreenData = MODULE_2_SCREENS[currentIndex];
  const totalScreens = MODULE_2_SCREENS.length;
  const moduleId = 'module-2-mythbusting';

  useEffect(() => {
    startModule(moduleId);
  }, [moduleId, startModule]);

  /**
   * Load saved reflection when reflection screen is displayed
   */
  useEffect(() => {
    if (currentScreenData.type === 'reflection') {
      const savedReflection = reflections['module-2-reflection']?.response;
      if (savedReflection) {
        setReflectionResponse(savedReflection);
      }
    }
  }, [currentScreenData.type, reflections]);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);
  };

  const handleReflectionSubmit = () => {
    saveReflection('module-2-reflection', reflectionResponse);
    setTimeout(() => handleNext(), 500);
  };

  const handleNext = () => {
    recordScreenProgress(moduleId, currentScreenData.id, totalScreens);
    const nextIndex = currentIndex + 1;
    if (nextIndex < totalScreens) {
      setCurrentIndex(nextIndex);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setReflectionResponse('');
    } else {
      completeModule(moduleId);
      navigate('/training/hub');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      navigate('/training/hub');
    }
  };

  const progress = ((currentIndex + 1) / totalScreens) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2">
            <div className="bg-primary-teal h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Screen Content */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          {/* Title */}
          {currentScreenData.title && (
            <h1 className="text-3xl font-bold text-white mb-2">{currentScreenData.title}</h1>
          )}
          {currentScreenData.subtitle && (
            <p className="text-xl text-primary-teal mb-6">{currentScreenData.subtitle}</p>
          )}

          {/* Content */}
          {currentScreenData.type === 'reflection' ? (
            <ReflectionScreen
              screen={currentScreenData}
              response={reflectionResponse}
              onResponseChange={setReflectionResponse}
              onSubmit={handleReflectionSubmit}
              onBack={handleBack}
            />
          ) : (
            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={createSanitizedMarkup(getScreenContent(currentScreenData))} />
          )}

          {/* Quiz/Scenario Options */}
          {(currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && currentScreenData.options && (
            <div className="mt-8">
              {/* Display the question */}
              {currentScreenData.question && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Question:</h2>
                  <p className="text-lg text-gray-200">{currentScreenData.question}</p>
                </div>
              )}
              {/* Display scenario */}
              {currentScreenData.scenario && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Scenario:</h2>
                  <p className="text-gray-300 whitespace-pre-line">{currentScreenData.scenario}</p>
                </div>
              )}
              <div className="space-y-3">
              {currentScreenData.options.map((option: QuizOption) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswerSelect(option.value)}
                  disabled={showFeedback}
                  className={`w-full text-left px-6 py-4 rounded-lg border transition-all ${
                    selectedAnswer === option.value
                      ? showFeedback && option.isCorrect
                        ? 'bg-green-400/20 border-green-400'
                        : showFeedback
                        ? 'bg-red-400/20 border-red-400'
                        : 'bg-primary-teal/20 border-primary-teal'
                      : 'bg-dark-bg border-dark-border hover:border-primary-teal'
                  } ${showFeedback ? 'cursor-default' : 'hover:bg-primary-teal/10'}`}
                >
                  <span className="text-gray-200 font-semibold">{option.label}</span>
                </button>
              ))}
              </div>
            </div>
          )}

          {/* Feedback */}
          {showFeedback && selectedAnswer && currentScreenData.options && (
            <div className={`mt-6 p-4 rounded-lg border ${
              selectedAnswer === currentScreenData.correctAnswer
                ? 'bg-green-400/10 border-green-400/30'
                : 'bg-red-400/10 border-red-400/30'
            }`}>
              <p className="text-gray-300">
                {currentScreenData.options.find((o: QuizOption) => o.value === selectedAnswer)?.feedback || ''}
              </p>
            </div>
          )}

          {/* Navigation */}
          {(currentScreenData.type === 'intro' || currentScreenData.type === 'content' ||
            currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && (
            <div className="flex justify-between items-center mt-8">
              <button onClick={handleBack}
                className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold">
                ← Back
              </button>
              <button onClick={handleNext}
                disabled={(currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && !showFeedback}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:bg-gray-700 disabled:cursor-not-allowed">
                {currentIndex === totalScreens - 1 ? 'Complete' : 'Next'} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Module 5: Mastery
 *
 * Navigate market volatility and master long-term psychology.
 */

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../../../stores/trainingStore';
import { createSanitizedMarkup } from '../../../../lib/utils/sanitizeHtml';
import { ReflectionScreen } from '../../shared/ReflectionScreen';
import type { ScreenContent, QuizOption } from '../types';

const MODULE_5_SCREENS: ScreenContent[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Welcome to Module 5: Mastery',
    subtitle: 'Navigate Volatility and Master Long-term Psychology',
    content: `
      <p class="text-xl mb-6">Welcome to <strong>Module 5: Mastery</strong> — your final step to long-term wealth.</p>

      <p class="mb-4">Most investors panic in market downturns. You'll learn to profit from them.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">What You'll Learn:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The Seven Freedom Facts about markets</li>
          <li>Bear market navigation strategies</li>
          <li>Missing the best days - the real cost</li>
          <li>Psychological mastery for long-term success</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6">
        <h3 class="text-white text-lg font-bold mb-2">⏱️ Time Investment</h3>
        <p class="text-gray-400">Approximately 15-20 minutes to complete this module</p>
      </div>

      <div class="bg-green-400/10 border border-green-400/30 rounded-lg p-6 my-6">
        <h3 class="text-green-400 text-xl font-bold mb-3">📈 The Freedom Fact</h3>
        <p class="text-gray-200">The stock market has gone up more than it's gone down throughout history. Every downturn has been followed by a new all-time high.</p>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-purple text-xl font-bold mb-3">🦁 Mastery Mindset</h3>
        <p class="text-gray-200">When others fear, you'll see opportunity. When others panic, you'll stay calm. This is the true path to wealth mastery.</p>
      </div>

      <p class="text-gray-400 italic mt-6">Ready to achieve true wealth mastery? Let's master your psychology.</p>
    `,
    meta: { duration: '15-20 min' }
  },
  {
    id: 'freedom-facts-1-3',
    type: 'content',
    title: 'Freedom Facts 1-3: Market Truths',
    subtitle: 'Liberating truths about how markets actually work',
    content: `
      <p class="text-lg mb-6">Let's start with the first three Freedom Facts — fundamental truths that transform how you think about markets.</p>

      <div class="bg-green-400/10 border-l-4 border-green-400 p-6 my-6 rounded-r-lg">
        <h2 class="text-green-400 font-bold text-2xl mb-3">Freedom Fact #1: Markets Go Up Over Time</h2>
        <p class="text-gray-300 mb-4">Despite wars, recessions, pandemics, and crises, the stock market has always gone up over long periods.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>The Numbers:</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• S&P 500 average annual return: ~10% (before inflation)</li>
            <li>• Over any 20-year period: NEVER had a negative return</li>
            <li>• Over any 30-year period: ALWAYS beaten inflation</li>
          </ul>
        </div>
      </div>

      <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-6 my-6 rounded-r-lg">
        <h2 class="text-primary-teal font-bold text-2xl mb-3">Freedom Fact #2: Bear Markets Are Temporary</h2>
        <p class="text-gray-300 mb-4">Every bear market in history has been followed by a recovery to new all-time highs.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>Historical Bear Markets (since 1950):</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• Average decline: -33%</li>
            <li>• Average recovery time: 1.5 years to new highs</li>
            <li>• Longest recovery: ~5 years (2000-2002 dot-com bust)</li>
            <li>• Every single one: Recovered eventually</li>
          </ul>
        </div>
      </div>

      <div class="bg-primary-purple/10 border-l-4 border-primary-purple p-6 my-6 rounded-r-lg">
        <h2 class="text-primary-purple font-bold text-2xl mb-3">Freedom Fact #3: Time in Market Beats Timing the Market</h2>
        <p class="text-gray-300 mb-4">No one can consistently predict market moves. The investors who win are the ones who stay invested.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>The Cost of Missing the Best Days:</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• Miss best 10 days over 20 years: Returns drop 50%</li>
            <li>• Miss best 20 days over 20 years: Returns drop 75%</li>
            <li>• Many of the best days occur during bear markets</li>
            <li>• The best days often follow the worst days</li>
          </ul>
        </div>
      </div>

      <div class="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-6 my-6">
        <h3 class="text-yellow-400 font-bold text-lg mb-2">💡 The Key Insight</h3>
        <p class="text-gray-200">The stock market is a wealth-building machine that occasionally has temporary setbacks. Successful investors understand this and stay the course.</p>
      </div>
    `,
  },
  {
    id: 'facts-quiz-1',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of Freedom Facts 1-3',
    content: `
      <p class="text-lg mb-6">Quick check on the first three Freedom Facts.</p>
    `,
    question: 'What percentage of the best market days occur during bear markets (when prices are falling)?',
    options: [
      { value: 'a', label: 'Almost none - the best days happen during bull markets', feedback: 'Incorrect! This is a common misconception. Many of the best days actually happen during bear markets as part of volatile recovery attempts.', isCorrect: false },
      { value: 'b', label: 'About 25% - some best days are in bear markets', feedback: 'Low estimate. The reality is that a significant portion of the best days occur during bear market periods.', isCorrect: false },
      { value: 'c', label: 'Over 60% - most best days are during bear markets', feedback: 'Correct! This is why staying invested during crashes is critical. If you sell, you\'ll likely miss the best recovery days that happen during volatility.', isCorrect: true },
      { value: 'd', label: '100% - ALL best days are in bear markets', feedback: 'Not quite! While many best days occur during bear markets, some do occur during bull markets as well.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'freedom-facts-4-7',
    type: 'content',
    title: 'Freedom Facts 4-7: Advanced Truths',
    subtitle: 'Deeper insights for market mastery',
    content: `
      <p class="text-lg mb-6">Now let's explore the final four Freedom Facts that separate masters from amateurs.</p>

      <div class="bg-blue-400/10 border-l-4 border-blue-400 p-6 my-6 rounded-r-lg">
        <h2 class="text-blue-400 font-bold text-2xl mb-3">Freedom Fact #4: Emotional Investors Buy High and Sell Low</h2>
        <p class="text-gray-300 mb-4">Fear and greed cause investors to do exactly the wrong thing at the wrong time.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>The Cycle of Destruction:</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• Market rises → Investors get excited → Buy at the top</li>
            <li>• Market falls → Investors panic → Sell at the bottom</li>
            <li>• Market recovers → Investors regret → Buy again at higher prices</li>
            <li>• Result: Buy high, sell low, repeat</li>
          </ul>
        </div>
      </div>

      <div class="bg-orange-400/10 border-l-4 border-orange-400 p-6 my-6 rounded-r-lg">
        <h2 class="text-orange-400 font-bold text-2xl mb-3">Freedom Fact #5: Volatility Is the Price of Admission</h2>
        <p class="text-gray-300 mb-4">Stock market returns come with volatility. You cannot have one without the other.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>The Volatility Reality:</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• Average year includes a 14% decline from peak to trough</li>
            <li>• 1 in 5 years has a decline of 20% or more</li>
            <li>• This is NORMAL, not a sign of broken markets</li>
            <li>• To get 10% returns, you must endure 14% drawdowns</li>
          </ul>
        </div>
      </div>

      <div class="bg-pink-400/10 border-l-4 border-pink-400 p-6 my-6 rounded-r-lg">
        <h2 class="text-pink-400 font-bold text-2xl mb-3">Freedom Fact #6: Diversification Is Your Only Free Lunch</h2>
        <p class="text-gray-300 mb-4">You can't control market returns, but you CAN control your risk through diversification.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>What Diversification Does:</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• Reduces volatility without reducing long-term returns</li>
            <li>• Uncorrelated assets smooth the ride</li>
            <li>• Prevents any single investment from destroying your wealth</li>
            <li>• Keeps you invested when one asset class struggles</li>
          </ul>
        </div>
      </div>

      <div class="bg-cyan-400/10 border-l-4 border-cyan-400 p-6 my-6 rounded-r-lg">
        <h2 class="text-cyan-400 font-bold text-2xl mb-3">Freedom Fact #7: The Market Climbs a Wall of Worry</h2>
        <p class="text-gray-300 mb-4">Markets advance despite problems, not because there are no problems.</p>
        <div class="bg-dark-bg p-4 rounded">
          <p class="text-gray-300 mb-2"><strong>The Wall of Worry:</strong></p>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>• There are always reasons NOT to invest</li>
            <li>• News headlines are always negative</li>
            <li>• Experts are always predicting crashes</li>
            <li>• Yet the market keeps going up over time</li>
          </ul>
        </div>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal font-bold text-lg mb-2">The Master's Mindset</h3>
        <p class="text-gray-200">When you understand these seven facts, market volatility becomes opportunity instead of threat. You become the calm investor while others panic.</p>
      </div>
    `,
  },
  {
    id: 'facts-quiz-2',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of Freedom Facts 4-7',
    content: `
      <p class="text-lg mb-6">Another check on your understanding of these advanced truths.</p>
    `,
    question: 'Why do most investors underperform the very funds they invest in?',
    options: [
      { value: 'a', label: 'They pick bad funds with poor performance', feedback: 'This happens, but even investors in good funds often underperform the fund itself. The issue is deeper.', isCorrect: false },
      { value: 'b', label: 'They pay too much in fees and taxes', feedback: 'True, but this doesn\'t fully explain the underperformance gap. The main cause is emotional behavior.', isCorrect: false },
      { value: 'c', label: 'They buy and sell at the wrong times due to emotions', feedback: 'Correct! Studies show investor behavior (buying high, selling low) causes 2-3% underperformance annually vs the funds they own.', isCorrect: true },
      { value: 'd', label: 'They don\'t diversify properly', feedback: 'While lack of diversification increases volatility, the primary cause of underperformance is emotional trading.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'bear-markets',
    type: 'content',
    title: 'Bear Market Navigation',
    subtitle: 'How to profit when others panic',
    content: `
      <p class="text-lg mb-6">Bear markets are inevitable. How you respond determines whether you build wealth or destroy it.</p>

      <h2 class="text-2xl font-bold text-white mb-4">What Is a Bear Market?</h2>
      <p class="text-gray-300 mb-4">A bear market is a decline of 20% or more from recent highs. They happen every 3-5 years on average.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-white font-bold text-lg mb-3">Historical Bear Markets (S&P 500)</h3>
        <table class="w-full text-gray-300 text-sm">
          <thead>
            <tr class="border-b border-dark-border">
              <th class="text-left py-2">Period</th>
              <th class="text-right py-2">Decline</th>
              <th class="text-right py-2">Duration</th>
              <th class="text-right py-2">Recovery</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">2000-2002</td>
              <td class="text-right text-red-400">-49%</td>
              <td class="text-right">31 months</td>
              <td class="text-right">49 months</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">2007-2009</td>
              <td class="text-right text-red-400">-57%</td>
              <td class="text-right">17 months</td>
              <td class="text-right">49 months</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">2020 (COVID)</td>
              <td class="text-right text-red-400">-34%</td>
              <td class="text-right">33 days</td>
              <td class="text-right">6 months</td>
            </tr>
            <tr>
              <td class="py-2">2022</td>
              <td class="text-right text-red-400">-25%</td>
              <td class="text-right">10 months</td>
              <td class="text-right text-green-400">Ongoing</td>
            </tr>
          </tbody>
        </table>
        <p class="text-gray-400 text-sm mt-4">Notice: Every crash recovered. Every. Single. One.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Three Types of Investors</h2>

      <div class="space-y-4 my-6">
        <div class="bg-red-400/10 border-l-4 border-red-400 p-4 rounded-r-lg">
          <h3 class="text-red-400 font-bold mb-2">🔴 The Panic Seller</h3>
          <p class="text-gray-300">Sells when markets fall, locks in losses, buys back after recovery. Result: Worst returns, highest stress.</p>
        </div>

        <div class="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 rounded-r-lg">
          <h3 class="text-yellow-400 font-bold mb-2">🟡 The Market Timer</h3>
          <p class="text-gray-300">Tries to predict bottoms and tops. Usually wrong. Sits in cash during recoveries. Result: Misses the best days.</p>
        </div>

        <div class="bg-green-400/10 border-l-4 border-green-400 p-4 rounded-r-lg">
          <h3 class="text-green-400 font-bold mb-2">🟢 The Master</h3>
          <p class="text-gray-300">Stays invested through volatility. May even buy more during crashes. Result: Best returns, lowest stress.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Bear Market Action Plan</h2>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <p class="text-white font-bold mb-3">When the market drops 20%+, the master investor:</p>
        <ol class="text-gray-300 space-y-2">
          <li><strong>Doesn't check portfolio daily</strong> — Volatility is normal</li>
          <li><strong>Remembers history</strong> — Every bear market has recovered</li>
          <li><strong>Considers buying more</strong> — Bear markets are discounts</li>
          <li><strong>Rebalances if needed</strong> — Sells bonds to buy stocks</li>
          <li><strong>Stays the course</strong> — Does nothing rash</li>
        </ol>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Secret Weapon: Automatic Investing</h2>
      <p class="text-gray-300 mb-4">The easiest way to master bear markets? Automatic monthly investing.</p>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <p class="text-gray-200 mb-3"><strong>Dollar-cost averaging</strong> means investing the same amount every month regardless of market conditions.</p>
        <ul class="text-gray-300 space-y-1 text-sm">
          <li>• You buy more shares when prices are low</li>
          <li>• You buy fewer shares when prices are high</li>
          <li>• You automatically "buy low" without thinking</li>
          <li>• Bear markets become opportunities, not threats</li>
        </ul>
      </div>
    `,
  },
  {
    id: 'market-quiz',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your bear market understanding',
    content: `
      <p class="text-lg mb-6">Check your understanding of bear markets and how to navigate them.</p>
    `,
    question: 'The S&P 500 drops 30% in a market crash. What does history say happens next?',
    options: [
      { value: 'a', label: 'It takes 10+ years to recover', feedback: 'Incorrect. While some recoveries take years (like 2000-2002), most are much faster. The average is 1-2 years to new highs.', isCorrect: false },
      { value: 'b', label: 'It recovers to new highs within 5 years', feedback: 'Correct! Every bear market in history has eventually recovered to new all-time highs. The average recovery is 1.5 years, with the longest being ~5 years.', isCorrect: true },
      { value: 'c', label: 'It never fully recovers - buy and hold is a myth', feedback: 'False! This is permabear thinking that has been wrong every time. The market ALWAYS recovers given enough time.', isCorrect: false },
      { value: 'd', label: 'It depends on why the crash happened', feedback: 'Incorrect! While causes vary, the outcome doesn\'t. Every crash - war, pandemic, financial crisis - has been followed by recovery.', isCorrect: false },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'crash-scenario',
    type: 'scenario',
    title: 'Market Crash Decision',
    subtitle: 'Apply what you\'ve learned',
    scenario: 'You turn on the news and see headlines:\n\n"MARKET IN FREEFALL"\n"S&P 500 DOWN 30% THIS YEAR"\n"EXPERTS PREDICT MORE PAIN TO COME"\n\nYour portfolio shows a loss of $45,000 on paper. You\'re reading this on your phone. Your thumb is hovering over the "SELL ALL" button in your brokerage app.\n\nYou remember the Freedom Facts, but your emotions are screaming at you to sell before things get worse.',
    question: 'What do you do?',
    options: [
      { value: 'sell', label: 'Sell everything - I can\'t afford to lose more', feedback: 'This is exactly what emotional investors do. You lock in a $45,000 loss permanently. History shows you\'ll likely buy back at higher prices after the recovery.', isCorrect: false },
      { value: 'hold', label: 'Stay the course - do nothing', feedback: 'Wise! You remember that every bear market in history has recovered. You don\'t lock in losses. You stay invested for the recovery.', isCorrect: true },
      { value: 'wait', label: 'Wait for a 10% rally before selling', feedback: 'This is market timing. What if the market drops another 10% first? What if it rallies 30% and you miss it? Don\'t try to outsmart the market.', isCorrect: false },
      { value: 'buy', label: 'Buy more - prices are on sale', feedback: 'Bold! This is what masters do. But if it causes you stress, holding is fine. The key is NOT selling.', isCorrect: true },
    ],
    correctAnswer: 'hold',
  },
  {
    id: 'reflection',
    type: 'reflection',
    title: 'Personal Mastery Reflection',
    subtitle: 'Your market psychology action plan',
    content: `
      <p class="text-lg mb-6">You've learned the Freedom Facts and bear market strategies. Now let's prepare for the next market cycle.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Reflect on These Questions:</h2>

      <div class="space-y-4 mb-6">
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">1. Past Behavior</h3>
          <p class="text-gray-300">How did you react to past market drops (2020, 2022)? Did you sell, hold, or buy? What emotions did you feel?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">2. Current Allocation</h3>
          <p class="text-gray-300">Is your portfolio diversified enough to handle a 30-50% drop without panic? If not, what adjustments are needed?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">3. Future Plan</h3>
          <p class="text-gray-300">When the next bear market hits (and it will), what will your action plan be? Write it down now while you're thinking clearly.</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">4. Automatic System</h3>
          <p class="text-gray-300">Can you set up automatic monthly investing to remove emotion from the equation? Can you automate rebalancing?</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Your Mastery Commitment:</h2>
      <p class="text-gray-300 mb-4">Write down your commitment to staying the course during the next market downturn:</p>
    `,
  },
  {
    id: 'complete',
    type: 'content',
    title: 'All 5 Modules Complete!',
    subtitle: 'You are now a Your Wealth graduate',
    content: `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎓🎉</div>
        <h2 class="text-3xl font-bold text-primary-teal mb-4">Congratulations, Graduate!</h2>
        <p class="text-xl text-gray-200">You've completed all 5 Your Wealth modules</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">Your Complete Journey:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li><strong>Module 1: Foundation</strong> — Money psychology and mindset</li>
          <li><strong>Module 2: Myth-Busting</strong> — Fee destruction and hidden costs</li>
          <li><strong>Module 3: Strategy</strong> — Asset allocation and rebalancing</li>
          <li><strong>Module 4: Execution</strong> — Advisors and conflicts of interest</li>
          <li><strong>Module 5: Mastery</strong> — Market psychology and bear markets</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-xl font-bold text-white mb-4">You Are Now Equipped With:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-300">
          <li>The 80/20 mindset that drives 80% of results</li>
          <li>Knowledge of the 9 financial myths that destroy wealth</li>
          <li>The Three-Bucket asset allocation system</li>
          <li>Ray Dalio's All Seasons portfolio strategy</li>
          <li>The 7 Questions to vet any advisor</li>
          <li>The Seven Freedom Facts about markets</li>
          <li>Bear market navigation strategies</li>
        </ul>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">What's Next:</h3>
        <p class="text-gray-200 mb-4">You've completed the training. Now it's time to take action.</p>
        <ul class="text-gray-300 space-y-2">
          <li>✓ Take the Financial Blueprint assessment</li>
          <li>✓ Input your financial data and generate your plan</li>
          <li>✓ Review your personalized results dashboard</li>
        </ul>
      </div>

      <div class="bg-gradient-to-r from-primary-teal/20 to-primary-purple/20 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-white font-bold text-lg mb-2">🦁 Master's Reminder</h3>
        <p class="text-gray-200">Knowledge isn't power — applied knowledge is power. The real value of this training comes from implementing what you've learned.</p>
      </div>

      <div class="text-center mt-8">
        <p class="text-gray-400 italic">Your progress has been saved. You now have the knowledge to build lasting wealth. The question is: will you take action?</p>
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

export default function Module5_Mastery() {
  const navigate = useNavigate();
  const { startModule, recordScreenProgress, completeModule, saveReflection, reflections } = useTrainingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reflectionResponse, setReflectionResponse] = useState('');
  const currentScreenData = MODULE_5_SCREENS[currentIndex];
  const totalScreens = MODULE_5_SCREENS.length;
  const moduleId = 'module-5-mastery';

  useEffect(() => { startModule(moduleId); }, [moduleId, startModule]);

  /**
   * Load saved reflection when reflection screen is displayed
   */
  useEffect(() => {
    if (currentScreenData.type === 'reflection') {
      const savedReflection = reflections['module-5-reflection']?.response;
      if (savedReflection) {
        setReflectionResponse(savedReflection);
      }
    }
  }, [currentScreenData.type, reflections]);

  const handleAnswerSelect = (answer: string) => { setSelectedAnswer(answer); setShowFeedback(true); };

  const handleReflectionSubmit = () => {
    saveReflection('module-5-reflection', reflectionResponse);
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
      setReflectionResponse('');
    } else {
      navigate('/training/hub');
    }
  };
  const progress = ((currentIndex + 1) / totalScreens) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6"><div className="w-full bg-dark-bg rounded-full h-2"><div className="bg-primary-teal h-2 rounded-full transition-all" style={{ width: `${progress}%` }} /></div></div>
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          {currentScreenData.title && <h1 className="text-3xl font-bold text-white mb-2">{currentScreenData.title}</h1>}
          {currentScreenData.subtitle && <p className="text-xl text-primary-teal mb-6">{currentScreenData.subtitle}</p>}
          {currentScreenData.type === 'reflection' ? (
            <ReflectionScreen
              screen={currentScreenData}
              response={reflectionResponse}
              onResponseChange={setReflectionResponse}
              onSubmit={handleReflectionSubmit}
              onBack={handleBack}
            />
          ) : (
            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={createSanitizedMarkup(getScreenContent(currentScreenData))} />
          )}
          {(currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && currentScreenData.options && (
            <div className="mt-8">
              {currentScreenData.question && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Question:</h2>
                  <p className="text-lg text-gray-200">{currentScreenData.question}</p>
                </div>
              )}
              {currentScreenData.scenario && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-4">Scenario:</h2>
                  <p className="text-gray-300 whitespace-pre-line">{currentScreenData.scenario}</p>
                </div>
              )}
              <div className="space-y-3">
              {currentScreenData.options.map((option: QuizOption) => (
                <button key={option.value} onClick={() => handleAnswerSelect(option.value)} disabled={showFeedback}
                  className={`w-full text-left px-6 py-4 rounded-lg border transition-all ${
                    selectedAnswer === option.value ? (showFeedback && option.isCorrect ? 'bg-green-400/20 border-green-400' : showFeedback ? 'bg-red-400/20 border-red-400' : 'bg-primary-teal/20 border-primary-teal') : 'bg-dark-bg border-dark-border hover:border-primary-teal'
                  }`}>
                  <span className="text-gray-200 font-semibold">{option.label}</span>
                </button>
              ))}
              </div>
            </div>
          )}
          {showFeedback && selectedAnswer && currentScreenData.options && (
            <div className={`mt-6 p-4 rounded-lg border ${selectedAnswer === currentScreenData.correctAnswer ? 'bg-green-400/10 border-green-400/30' : 'bg-red-400/10 border-red-400/30'}`}>
              <p className="text-gray-300">{currentScreenData.options.find((o: QuizOption) => o.value === selectedAnswer)?.feedback || ''}</p>
            </div>
          )}
          {(currentScreenData.type === 'intro' || currentScreenData.type === 'content' || currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && (
            <div className="flex justify-between items-center mt-8">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 font-semibold">← Back</button>
              <button onClick={handleNext} disabled={(currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && !showFeedback} className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold disabled:bg-gray-700">{currentIndex === totalScreens - 1 ? 'Complete' : 'Next'} →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

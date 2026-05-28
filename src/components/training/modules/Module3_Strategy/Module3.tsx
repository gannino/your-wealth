/**
 * Module 3: Strategy
 *
 * Master asset allocation and core investment principles.
 */

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../../../stores/trainingStore';
import { createSanitizedMarkup } from '../../../../lib/utils/sanitizeHtml';
import { ReflectionScreen } from '../../shared/ReflectionScreen';
import type { ScreenContent, QuizOption } from '../types';

const MODULE_3_SCREENS: ScreenContent[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Welcome to Module 3: Strategy',
    subtitle: 'Master Asset Allocation and Core Investment Principles',
    content: `
      <p class="text-xl mb-6">Welcome to <strong>Module 3: Strategy</strong> — your blueprint for building wealth through smart asset allocation.</p>

      <p class="mb-4">Most investors obsess over picking the right stocks. The wealthiest investors? They focus on something far more powerful: <strong>asset allocation</strong>.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">What You'll Learn:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The Three-Bucket system for balancing security and growth</li>
          <li>Ray Dalio's Core Four: All Seasons portfolio</li>
          <li>How to rebalance your portfolio automatically</li>
          <li>The power of uncorrelated assets</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6">
        <h3 class="text-white text-lg font-bold mb-2">⏱️ Time Investment</h3>
        <p class="text-gray-400">Approximately 20-25 minutes to complete this module</p>
      </div>

      <div class="bg-green-400/10 border border-green-400/30 rounded-lg p-6 my-6">
        <h3 class="text-green-400 text-xl font-bold mb-3">📊 The Golden Rule</h3>
        <p class="text-gray-200 mb-4"><strong>Asset allocation determines 90% of your returns.</strong></p>
        <p class="text-gray-200">Not stock picking. Not market timing. The mix of assets you hold is the single biggest driver of long-term wealth.</p>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-purple text-xl font-bold mb-3">💡 What Makes This Different</h3>
        <p class="text-gray-200 mb-4">Traditional advice says "buy low, sell high." But how do you know when is low and when is high?</p>
        <p class="text-gray-200">The strategies in this module work <strong>automatically</strong> — no crystal ball required.</p>
      </div>

      <p class="text-gray-400 italic mt-6">Ready to build a portfolio that weathers any storm? Let's dive into strategy.</p>
    `,
    meta: { duration: '20-25 min' }
  },
  {
    id: 'asset-allocation-principle',
    type: 'content',
    title: 'The Asset Allocation Principle',
    subtitle: 'Why 90% of your returns come from this one decision',
    content: `
      <p class="text-lg mb-6">Before we get into specific strategies, let's understand WHY asset allocation matters so much.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Research That Changed Everything</h2>
      <p class="text-gray-300 mb-4">In 1986, a landmark study by Brinson, Hood, and Beebower examined 91 large pension funds from 1974-1983. They wanted to know: what actually drives investment returns?</p>

      <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-6 my-6 rounded-r-lg">
        <p class="text-white font-semibold text-lg mb-2">The Finding:</p>
        <p class="text-gray-200"><strong>93.6% of return variability</strong> came from asset allocation — the mix of stocks, bonds, and cash.</p>
        <p class="text-gray-200 mt-2">Stock picking? 2.5%. Market timing? 1.7%. Everything else? Negligible.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">What This Means For You</h2>
      <p class="text-gray-300 mb-4">Most investors spend 100% of their energy trying to pick the "right" stocks or time the market. They're focusing on the 4% that doesn't matter and ignoring the 96% that does.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-primary-teal font-bold text-xl mb-3">The Two Investors</h3>
        <p class="text-gray-300 mb-4">Two investors start with $100,000. Both invest for 30 years.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div class="bg-red-400/10 p-4 rounded border border-red-400/30">
            <p class="text-red-400 font-bold mb-2">Investor A</p>
            <ul class="text-gray-300 text-sm list-disc ml-4">
              <li>Spends hours researching stocks</li>
              <li>Constantly buys and sells</li>
              <li>Chases hot tips</li>
              <li>Pays high fees and taxes</li>
              <li>Final: $380,000</li>
            </ul>
          </div>
          <div class="bg-green-400/10 p-4 rounded border border-green-400/30">
            <p class="text-green-400 font-bold mb-2">Investor B</p>
            <ul class="text-gray-300 text-sm list-disc ml-4">
              <li>Picks simple asset allocation</li>
              <li>Rebalances once a year</li>
              <li>Never watches financial news</li>
              <li>Pays minimal fees</li>
              <li>Final: $760,000</li>
            </ul>
          </div>
        </div>
        <p class="text-primary-teal font-semibold mt-4">Same starting amount. Same time period. One decision made the difference: asset allocation.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Asset Classes</h2>
      <p class="text-gray-300 mb-4">Asset allocation is simply deciding how much to put in each major asset class:</p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div class="bg-dark-bg p-4 rounded border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">Stocks</h3>
          <p class="text-gray-400 text-sm">Ownership in companies. High growth, high volatility. Long-term: 7-10% returns.</p>
        </div>
        <div class="bg-dark-bg p-4 rounded border border-dark-border">
          <h3 class="text-green-400 font-bold mb-2">Bonds</h3>
          <p class="text-gray-400 text-sm">Loans to governments/companies. Lower growth, lower volatility. Long-term: 3-5% returns.</p>
        </div>
        <div class="bg-dark-bg p-4 rounded border border-dark-border">
          <h3 class="text-yellow-400 font-bold mb-2">Alternatives</h3>
          <p class="text-gray-400 text-sm">Real estate, gold, commodities. Diversification from stocks/bonds.</p>
        </div>
      </div>
    `,
  },
  {
    id: 'allocation-quiz-1',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of asset allocation',
    content: `
      <p class="text-lg mb-6">Quick check on what you've learned about the importance of asset allocation.</p>
    `,
    question: 'According to the Brinson study, what percentage of return variability comes from asset allocation?',
    options: [
      { value: 'a', label: 'About 50% - Asset allocation and stock picking matter equally', feedback: 'Incorrect. Stock picking and market timing combined account for less than 5% of return variability.', isCorrect: false },
      { value: 'b', label: 'About 75% - Asset allocation is important but not dominant', feedback: 'Close, but the actual finding is even stronger. Asset allocation is far more important than most people realize.', isCorrect: false },
      { value: 'c', label: 'Over 90% - Asset allocation dominates returns', feedback: 'Correct! The study found 93.6% of return variability comes from asset allocation. Everything else is noise.', isCorrect: true },
      { value: 'd', label: 'About 25% - Stock picking is more important', feedback: 'Incorrect. This is the opposite of what the research shows. Stock picking accounts for less than 3%.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'three-buckets',
    type: 'content',
    title: 'The Three-Bucket System',
    subtitle: 'Balance security, growth, and dreams',
    content: `
      <p class="text-lg mb-6">Now let's learn a practical framework for asset allocation that anyone can use: the Three-Bucket System.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Three Buckets Explained</h2>
      <p class="text-gray-300 mb-4">Instead of thinking about "stocks vs bonds," think about three buckets based on purpose and time horizon:</p>

      <div class="space-y-4 my-6">
        <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-6 rounded-r-lg">
          <h3 class="text-primary-teal font-bold text-xl mb-2">🛡️ Bucket 1: Security</h3>
          <p class="text-gray-300 mb-2"><strong>Purpose:</strong> Capital preservation and emergency fund</p>
          <p class="text-gray-300 mb-2"><strong>Time Horizon:</strong> 0-3 years (money you need soon)</p>
          <p class="text-gray-300 mb-2"><strong>Investments:</strong> Cash, high-yield savings, short-term CDs, money market funds</p>
          <p class="text-gray-400 text-sm mt-3">Target: 3-6 months of expenses. This is your safety net.</p>
        </div>

        <div class="bg-green-400/10 border-l-4 border-green-400 p-6 rounded-r-lg">
          <h3 class="text-green-400 font-bold text-xl mb-2">📈 Bucket 2: Growth</h3>
          <p class="text-gray-300 mb-2"><strong>Purpose:</strong> Long-term wealth building</p>
          <p class="text-gray-300 mb-2"><strong>Time Horizon:</strong> 10+ years (money for retirement and distant goals)</p>
          <p class="text-gray-300 mb-2"><strong>Investments:</strong> Stock index funds (total market, S&P 500, international)</p>
          <p class="text-gray-400 text-sm mt-3">Target: Largest portion of portfolio. This is where compounding creates wealth.</p>
        </div>

        <div class="bg-yellow-400/10 border-l-4 border-yellow-400 p-6 rounded-r-lg">
          <h3 class="text-yellow-400 font-bold text-xl mb-2">🎯 Bucket 3: Dream</h3>
          <p class="text-gray-300 mb-2"><strong>Purpose:</strong> Aspirational goals and luxuries</p>
          <p class="text-gray-300 mb-2"><strong>Time Horizon:</strong> 3-10 years (medium-term goals)</p>
          <p class="text-gray-300 mb-2"><strong>Investments:</strong> Balanced mix of stocks/bonds (60/40 or target date funds)</p>
          <p class="text-gray-400 text-sm mt-3">Target: Down payment, dream vacation, business startup. Less volatile than Growth bucket.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">How Much Goes In Each Bucket?</h2>
      <p class="text-gray-300 mb-4">It depends on your age and goals, but here's a starting framework:</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <table class="w-full text-gray-300">
          <thead>
            <tr class="border-b border-dark-border">
              <th class="text-left py-2">Age</th>
              <th class="text-left py-2">Security</th>
              <th class="text-left py-2">Growth</th>
              <th class="text-left py-2">Dream</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">20s</td>
              <td class="py-2">10%</td>
              <td class="py-2">70%</td>
              <td class="py-2">20%</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">30s</td>
              <td class="py-2">15%</td>
              <td class="py-2">60%</td>
              <td class="py-2">25%</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">40s</td>
              <td class="py-2">20%</td>
              <td class="py-2">50%</td>
              <td class="py-2">30%</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">50s</td>
              <td class="py-2">25%</td>
              <td class="py-2">40%</td>
              <td class="py-2">35%</td>
            </tr>
            <tr>
              <td class="py-2">60s+</td>
              <td class="py-2">30%</td>
              <td class="py-2">30%</td>
              <td class="py-2">40%</td>
            </tr>
          </tbody>
        </table>
        <p class="text-gray-400 text-sm mt-4">These are guidelines, not rules. Adjust based on your risk tolerance and goals.</p>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-purple font-bold text-lg mb-2">Key Insight</h3>
        <p class="text-gray-200">As you age, Security grows and Growth shrinks — but Growth never goes to zero. Even in retirement, you need growth to outpace inflation.</p>
      </div>
    `,
  },
  {
    id: 'bucket-quiz',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of the Three-Bucket system',
    content: `
      <p class="text-lg mb-6">Let's verify your understanding of the Three-Bucket framework.</p>
    `,
    question: 'You\'re 35 years old and saving for a house down payment in 5 years. Which bucket should this money go in?',
    options: [
      { value: 'a', label: 'Security bucket - it\'s important money', feedback: 'Not quite. Security is for money you need in 0-3 years (emergency fund). 5 years is a bit long for cash-like investments.', isCorrect: false },
      { value: 'b', label: 'Growth bucket - maximize returns', feedback: 'Incorrect. Growth is for money you won\'t need for 10+ years. 5 years is too short to weather stock market volatility.', isCorrect: false },
      { value: 'c', label: 'Dream bucket - medium-term goal', feedback: 'Correct! The Dream bucket is for 3-10 year goals like a house down payment. It balances growth with stability.', isCorrect: true },
      { value: 'd', label: 'Split equally across all three', feedback: 'While diversification is good, the Dream bucket exists specifically for this medium-term timeframe. Use it intentionally.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'core-four',
    type: 'content',
    title: 'The Core Four: All Seasons Portfolio',
    subtitle: 'Ray Dalio\'s recession-proof strategy',
    content: `
      <p class="text-lg mb-6">Now let's explore a specific asset allocation strategy from one of the world's most successful investors: Ray Dalio's "All Seasons" portfolio.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Who Is Ray Dalio?</h2>
      <p class="text-gray-300 mb-4">Ray Dalio founded Bridgewater Associates, the world's largest hedge fund with over $150 billion in assets. He created the "All Seasons" portfolio to perform well in ANY economic environment.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Four Economic Seasons</h2>
      <p class="text-gray-300 mb-4">Dalio observed that the economy moves through four seasons. Each season favors different investments:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-green-400/10 p-4 rounded border border-green-400/30">
          <h3 class="text-green-400 font-bold mb-2">🌱 Season 1: Growth</h3>
          <p class="text-gray-400 text-sm mb-2">Economy expanding, inflation low</p>
          <p class="text-gray-300 text-sm">Winner: Stocks</p>
        </div>
        <div class="bg-yellow-400/10 p-4 rounded border border-yellow-400/30">
          <h3 class="text-yellow-400 font-bold mb-2">🔥 Season 2: Inflation</h3>
          <p class="text-gray-400 text-sm mb-2">Economy expanding, inflation high</p>
          <p class="text-gray-300 text-sm">Winner: Gold, commodities</p>
        </div>
        <div class="bg-blue-400/10 p-4 rounded border border-blue-400/30">
          <h3 class="text-blue-400 font-bold mb-2">❄️ Season 3: Deflation</h3>
          <p class="text-gray-400 text-sm mb-2">Economy contracting, inflation falling</p>
          <p class="text-gray-300 text-sm">Winner: Long-term bonds</p>
        </div>
        <div class="bg-red-400/10 p-4 rounded border border-red-400/30">
          <h3 class="text-red-400 font-bold mb-2">🍂 Season 4: Recession</h3>
          <p class="text-gray-400 text-sm mb-2">Economy contracting, inflation rising</p>
          <p class="text-gray-300 text-sm">Winner: Cash, short-term bonds</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The All Seasons Allocation</h2>
      <p class="text-gray-300 mb-4">To perform in all four seasons, Dalio allocates across four uncorrelated assets:</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <div class="space-y-4">
          <div class="flex items-center justify-between border-b border-dark-border/50 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-16 h-2 bg-primary-teal rounded" style="width: 30%"></div>
              <span class="text-gray-300 font-semibold">Stocks</span>
            </div>
            <span class="text-gray-400">30%</span>
          </div>
          <div class="flex items-center justify-between border-b border-dark-border/50 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-16 h-2 bg-blue-400 rounded" style="width: 40%"></div>
              <span class="text-gray-300 font-semibold">Long-term Bonds</span>
            </div>
            <span class="text-gray-400">40%</span>
          </div>
          <div class="flex items-center justify-between border-b border-dark-border/50 pb-3">
            <div class="flex items-center gap-3">
              <div class="w-16 h-2 bg-green-400 rounded" style="width: 15%"></div>
              <span class="text-gray-300 font-semibold">Intermediate Bonds</span>
            </div>
            <span class="text-gray-400">15%</span>
          </div>
          <div class="flex items-center justify-between pb-3">
            <div class="flex items-center gap-3">
              <div class="w-16 h-2 bg-yellow-400 rounded" style="width: 15%"></div>
              <span class="text-gray-300 font-semibold">Gold</span>
            </div>
            <span class="text-gray-400">15%</span>
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Why This Works</h2>
      <p class="text-gray-300 mb-4">The magic is <strong>uncorrelated assets</strong> — investments that don't move together:</p>

      <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-6 my-6 rounded-r-lg">
        <ul class="text-gray-300 space-y-2">
          <li>When stocks crash → bonds often rise</li>
          <li>When inflation spikes → gold protects purchasing power</li>
          <li>When deflation hits → long-term bonds soar</li>
          <li>When economy grows → stocks lead the way</li>
        </ul>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-purple font-bold text-lg mb-2">Performance</h3>
        <p class="text-gray-200">Since 1984, the All Seasons portfolio has returned ~7-8% annually with much lower volatility than the stock market alone. It underperforms in raging bull markets but holds up much better in crashes.</p>
      </div>
    `,
  },
  {
    id: 'core-four-quiz',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of the Core Four',
    content: `
      <p class="text-lg mb-6">Check your understanding of why the All Seasons portfolio works.</p>
    `,
    question: 'What makes the All Seasons portfolio effective across different economic conditions?',
    options: [
      { value: 'a', label: 'It\'s heavily invested in stocks for maximum growth', feedback: 'Incorrect. All Seasons is actually only 30% stocks. It\'s designed for stability, not maximum growth.', isCorrect: false },
      { value: 'b', label: 'It uses uncorrelated assets that perform differently in each economic season', feedback: 'Correct! The magic is owning assets that don\'t move together — when one struggles, another thrives.', isCorrect: true },
      { value: 'c', label: 'It actively shifts allocation based on market conditions', feedback: 'Incorrect. All Seasons is a static allocation — you set it and forget it. No active trading or market timing.', isCorrect: false },
      { value: 'd', label: 'It focuses on high-yield investments for maximum income', feedback: 'Incorrect. All Seasons focuses on total return and stability, not yield. Many components have low yields.', isCorrect: false },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'rebalancing',
    type: 'content',
    title: 'The Art of Rebalancing',
    subtitle: 'How to maintain your target allocation automatically',
    content: `
      <p class="text-lg mb-6">You've chosen your asset allocation. But markets move, and your allocation drifts. Enter: rebalancing.</p>

      <h2 class="text-2xl font-bold text-white mb-4">What Is Rebalancing?</h2>
      <p class="text-gray-300 mb-4">Rebalancing means selling assets that have grown beyond your target and buying assets that have fallen below your target. This restores your intended allocation.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Why Rebalance?</h2>
      <p class="text-gray-300 mb-4">Rebalancing does two powerful things:</p>

      <div class="space-y-4 my-6">
        <div class="bg-green-400/10 border-l-4 border-green-400 p-4 rounded-r-lg">
          <h3 class="text-green-400 font-bold mb-2">1. Controls Risk</h3>
          <p class="text-gray-300">Without rebalancing, a bull market can make your portfolio too stock-heavy. When the crash comes, you're exposed more than you intended. Rebalancing keeps your risk level consistent.</p>
        </div>

        <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-4 rounded-r-lg">
          <h3 class="text-primary-teal font-bold mb-2">2. Locks In Gains</h3>
          <p class="text-gray-300">When stocks soar and you sell some to buy bonds, you're selling high and buying low automatically. You don't need to predict markets — you just follow your allocation.</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">How Rebalancing Works: An Example</h2>
      <p class="text-gray-300 mb-4">You start with a 60/40 stocks/bonds split ($60k stocks, $40k bonds):</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <table class="w-full text-gray-300 text-sm">
          <thead>
            <tr class="border-b border-dark-border">
              <th class="text-left py-2">Scenario</th>
              <th class="text-right py-2">Stocks</th>
              <th class="text-right py-2">Bonds</th>
              <th class="text-right py-2">Total</th>
              <th class="text-left py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">Starting</td>
              <td class="text-right">$60k (60%)</td>
              <td class="text-right">$40k (40%)</td>
              <td class="text-right">$100k</td>
              <td class="text-left">—</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">Bull market</td>
              <td class="text-right">$84k (70%)</td>
              <td class="text-right">$36k (30%)</td>
              <td class="text-right">$120k</td>
              <td class="text-left text-red-400">Drifted!</td>
            </tr>
            <tr class="border-b border-dark-border/50">
              <td class="py-2">Rebalance</td>
              <td class="text-right">$72k (60%)</td>
              <td class="text-right">$48k (40%)</td>
              <td class="text-right">$120k</td>
              <td class="text-left text-green-400">Sell $12k stocks, buy bonds</td>
            </tr>
            <tr>
              <td class="py-2">Result</td>
              <td class="text-right" colspan="4">You've locked in $12k of stock gains and restored your risk level.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">How Often Should You Rebalance?</h2>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <p class="text-gray-200 mb-4">There are three approaches:</p>
        <ul class="text-gray-300 space-y-2">
          <li><strong>Time-based:</strong> Rebalance every 6-12 months (simplest, often on your birthday)</li>
          <li><strong>Threshold-based:</strong> Rebalance when any asset is 5% off target (more responsive)</li>
          <li><strong>Contribution-based:</strong> Direct new money to underweighted assets (most tax-efficient)</li>
        </ul>
        <p class="text-gray-400 mt-4">For most investors, annual rebalancing is sufficient. More frequent trading adds costs without meaningful benefit.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Lazy Investor's Secret</h2>
      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <p class="text-gray-200 mb-4">Many target date funds and robo-advisors rebalance automatically. If you use these services, you don't have to think about it.</p>
        <p class="text-gray-400 text-sm">But now you understand what they're doing — and why it matters.</p>
      </div>
    `,
  },
  {
    id: 'rebalance-scenario',
    type: 'scenario',
    title: 'Rebalancing Decision',
    subtitle: 'Apply what you\'ve learned',
    scenario: 'You set up a 70/30 stock/bond allocation in your 401(k). You check it after one year and find:\n\nStocks: $84,000 (up 20%)\nBonds: $31,000 (up 3%)\nTotal: $115,000\n\nYour current allocation is now 73/27, not 70/30. Your company allows free rebalancing.',
    question: 'What do you do?',
    options: [
      { value: 'hold', label: 'Do nothing - stocks are winning, let them run', feedback: 'Risky! Your portfolio has drifted to a riskier level than you intended. If stocks crash now, you\'ll lose more than planned.', isCorrect: false },
      { value: 'rebalance', label: 'Sell $3,450 of stocks, buy bonds to restore 70/30', feedback: 'Correct! This locks in some stock gains and restores your intended risk level. Systematic rebalancing beats market timing.', isCorrect: true },
      { value: 'double', label: 'Add more money to stocks since they\'re performing well', feedback: 'Dangerous! This is momentum chasing — buying what\'s already gone up. It increases your risk exactly when stocks may be expensive.', isCorrect: false },
    ],
    correctAnswer: 'rebalance',
  },
  {
    id: 'reflection',
    type: 'reflection',
    title: 'Personal Strategy Reflection',
    subtitle: 'Create your asset allocation plan',
    content: `
      <p class="text-lg mb-6">You've learned the core principles of asset allocation. Now let's apply them to YOUR situation.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Reflect on These Questions:</h2>

      <div class="space-y-4 mb-6">
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">1. Current Allocation</h3>
          <p class="text-gray-300">What's your current asset allocation? (Check all accounts: 401k, IRA, brokerage). Do you even know?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">2. Three-Bucket Plan</h3>
          <p class="text-gray-300">Based on your age and goals, what percentage should go in Security, Growth, and Dream buckets?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">3. Rebalancing Strategy</h3>
          <p class="text-gray-300">How will you rebalance? Annually? When assets drift 5%? Or will you use a service that does it automatically?</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Your Action Commitment:</h2>
      <p class="text-gray-300 mb-4">Write down one specific action you'll take in the next 30 days to improve your asset allocation:</p>
    `,
  },
  {
    id: 'complete',
    type: 'content',
    title: 'Module 3 Complete!',
    subtitle: 'You\'ve mastered asset allocation principles',
    content: `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-primary-teal mb-4">Congratulations!</h2>
        <p class="text-xl text-gray-200">You've completed Module 3: Strategy</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">Key Takeaways:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>Asset allocation determines 90% of your returns</li>
          <li>The Three-Bucket system balances security, growth, and dreams</li>
          <li>Ray Dalio's All Seasons portfolio performs in any economic environment</li>
          <li>Rebalancing controls risk and locks in gains automatically</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-xl font-bold text-white mb-4">What's Next:</h3>
        <p class="text-gray-300 mb-4">You know what to invest in. Now learn how to execute without getting ripped off.</p>

        <p class="text-gray-300 mb-4">In <strong>Module 4: Execution</strong>, you'll discover:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-400">
          <li>Broker vs. Fiduciary - the critical difference</li>
          <li>The 7 Questions to ask any advisor</li>
          <li>How to spot conflicts of interest</li>
          <li>Defense First investing strategy</li>
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

export default function Module3_Strategy() {
  const navigate = useNavigate();
  const { startModule, recordScreenProgress, completeModule, saveReflection, reflections } = useTrainingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reflectionResponse, setReflectionResponse] = useState('');
  const currentScreenData = MODULE_3_SCREENS[currentIndex];
  const totalScreens = MODULE_3_SCREENS.length;
  const moduleId = 'module-3-strategy';

  useEffect(() => { startModule(moduleId); }, [moduleId, startModule]);

  /**
   * Load saved reflection when reflection screen is displayed
   */
  useEffect(() => {
    if (currentScreenData.type === 'reflection') {
      const savedReflection = reflections['module-3-reflection']?.response;
      if (savedReflection) {
        setReflectionResponse(savedReflection);
      }
    }
  }, [currentScreenData.type, reflections]);

  const handleAnswerSelect = (answer: string) => { setSelectedAnswer(answer); setShowFeedback(true); };

  const handleReflectionSubmit = () => {
    saveReflection('module-3-reflection', reflectionResponse);
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
        <div className="mb-6">
          <div className="w-full bg-dark-bg rounded-full h-2">
            <div className="bg-primary-teal h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
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
            <div className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={createSanitizedMarkup(getScreenContent(currentScreenData))} />
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
                    selectedAnswer === option.value
                      ? showFeedback && option.isCorrect ? 'bg-green-400/20 border-green-400'
                        : showFeedback ? 'bg-red-400/20 border-red-400'
                        : 'bg-primary-teal/20 border-primary-teal'
                      : 'bg-dark-bg border-dark-border hover:border-primary-teal'
                  }`}>
                  <span className="text-gray-200 font-semibold">{option.label}</span>
                </button>
              ))}
              </div>
            </div>
          )}
          {showFeedback && selectedAnswer && currentScreenData.options && (
            <div className={`mt-6 p-4 rounded-lg border ${
              selectedAnswer === currentScreenData.correctAnswer ? 'bg-green-400/10 border-green-400/30' : 'bg-red-400/10 border-red-400/30'
            }`}>
              <p className="text-gray-300">{currentScreenData.options.find((o: QuizOption) => o.value === selectedAnswer)?.feedback || ''}</p>
            </div>
          )}
          {(currentScreenData.type === 'intro' || currentScreenData.type === 'content' || currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && (
            <div className="flex justify-between items-center mt-8">
              <button onClick={handleBack} className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 font-semibold">← Back</button>
              <button onClick={handleNext} disabled={(currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') && !showFeedback}
                className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold disabled:bg-gray-700">
                {currentIndex === totalScreens - 1 ? 'Complete' : 'Next'} →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

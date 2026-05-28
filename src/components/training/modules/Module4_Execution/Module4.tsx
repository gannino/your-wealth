/**
 * Module 4: Execution
 *
 * Select investments and advisors wisely.
 */

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../../../stores/trainingStore';
import { createSanitizedMarkup } from '../../../../lib/utils/sanitizeHtml';
import { ReflectionScreen } from '../../shared/ReflectionScreen';
import type { ScreenContent, QuizOption } from '../types';

const MODULE_4_SCREENS: ScreenContent[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Welcome to Module 4: Execution',
    subtitle: 'Select Investments and Advisors Wisely',
    content: `
      <p class="text-xl mb-6">Welcome to <strong>Module 4: Execution</strong> — where theory becomes action.</p>

      <p class="mb-4">You know what to invest in. Now learn how to execute without getting ripped off.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">What You'll Learn:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>Broker vs. Fiduciary - the critical difference</li>
          <li>The 7 Questions to ask any advisor</li>
          <li>How to spot conflicts of interest</li>
          <li>Defense First investing strategy</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6">
        <h3 class="text-white text-lg font-bold mb-2">⏱️ Time Investment</h3>
        <p class="text-gray-400">Approximately 15-20 minutes to complete this module</p>
      </div>

      <div class="bg-red-400/10 border border-red-400/30 rounded-lg p-6 my-6">
        <h3 class="text-red-400 text-xl font-bold mb-3">⚠️ The Shocking Truth</h3>
        <p class="text-gray-200">Most "financial advisors" are actually brokers who put commissions ahead of your interests. This single mistake can cost you hundreds of thousands in lifetime fees.</p>
      </div>

      <p class="text-gray-400 italic mt-6">Ready to execute with confidence? Let's protect your wealth from the predators.</p>
    `,
    meta: { duration: '15-20 min' }
  },
  {
    id: 'broker-vs-fiduciary',
    type: 'content',
    title: 'Broker vs. Fiduciary',
    subtitle: 'The critical distinction that affects your wealth',
    content: `
      <p class="text-lg mb-6">The financial industry deliberately blurs the lines between two very different types of "advisors." Understanding this distinction is essential to protecting your wealth.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Two Very Different Standards</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div class="bg-red-400/10 p-6 rounded-lg border border-red-400/30">
          <h3 class="text-red-400 font-bold text-xl mb-3">🔴 Broker</h3>
          <p class="text-gray-300 mb-3">Also called: "Registered Representative," "Financial Advisor," "Wealth Manager"</p>
          <ul class="text-gray-300 space-y-2 text-sm">
            <li><strong>Standard:</strong> "Suitable" (can sell anything that's "suitable" — often what pays them the most)</li>
            <li><strong>Obligation:</strong> To their employer's profits, not to you</li>
            <li><strong>Paid by:</strong> Commissions and sales charges</li>
            <li><strong>Products:</strong> What their company sells (high-fee mutual funds, annuities, proprietary products)</li>
            <li><strong>Conflict:</strong> Incentivized to sell what pays them, not what's best for you</li>
          </ul>
          <div class="mt-4 p-3 bg-red-400/20 rounded">
            <p class="text-red-300 text-sm font-semibold">⚠️ This is 90% of "financial advisors"</p>
          </div>
        </div>

        <div class="bg-green-400/10 p-6 rounded-lg border border-green-400/30">
          <h3 class="text-green-400 font-bold text-xl mb-3">🟢 Fiduciary</h3>
          <p class="text-gray-300 mb-3">Also called: "Registered Investment Advisor," "Fee-Only Advisor," "Investment Counsel"</p>
          <ul class="text-gray-300 space-y-2 text-sm">
            <li><strong>Standard:</strong> "Best interest" (must act in your best interest at all times)</li>
            <li><strong>Obligation:</strong> Legal duty to you, the client</li>
            <li><strong>Paid by:</strong> Flat fees or percentage of assets (no commissions)</li>
            <li><strong>Products:</strong> Can recommend any investment (low-cost index funds, ETFs, etc.)</li>
            <li><strong>Conflict:</strong> Minimal - they make the same regardless of what you choose</li>
          </ul>
          <div class="mt-4 p-3 bg-green-400/20 rounded">
            <p class="text-green-300 text-sm font-semibold">✓ This is what you want</p>
          </div>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Language Trap</h2>
      <p class="text-gray-300 mb-4">Brokers call themselves "financial advisors" because it sounds professional. But legally, they're salespeople.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <p class="text-gray-400 italic mb-4">"Calling a broker a 'financial advisor' is like calling a used car salesman a 'transportation consultant.' The title doesn't change the incentive."</p>
        <p class="text-gray-500 text-sm text-right">— Theodor Bernstein, consumer advocate</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">How to Spot the Difference</h2>
      <p class="text-gray-300 mb-4">Ask ONE question to instantly identify a broker:</p>

      <div class="bg-primary-teal/10 border-l-4 border-primary-teal p-6 my-6 rounded-r-lg">
        <p class="text-white font-bold text-xl mb-3">"Are you a fiduciary?"</p>
        <div class="space-y-3">
          <p class="text-gray-300"><strong>Fiduciary says:</strong> "Yes, I'm a fiduciary and I act as a fiduciary for all my clients."</p>
          <p class="text-gray-300"><strong>Broker says:</strong> "Well, I'm not really a fiduciary, but I always do what's right for my clients..." or "I act in your best interest when giving advice..."</p>
        </div>
        <p class="text-primary-teal mt-4 text-sm">If it's not an immediate "Yes," walk away.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Cost of Confusion</h2>
      <p class="text-gray-300 mb-4">Working with a broker instead of a fiduciary typically costs 1-2% more in fees annually.</p>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <p class="text-gray-200 mb-2">Over 30 years, on a $500,000 portfolio:</p>
        <p class="text-white font-bold text-lg">That's $500,000 - $1,000,000 transferred from your retirement to the broker's lifestyle.</p>
        <p class="text-gray-400 mt-3 text-sm">This is the single most expensive mistake most investors make.</p>
      </div>
    `,
  },
  {
    id: 'broker-quiz',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of brokers vs fiduciaries',
    content: `
      <p class="text-lg mb-6">Quick check to make sure you can spot the difference.</p>
    `,
    question: 'Your "financial advisor" recommends an annuity with a 7% commission. When you ask if they\'re a fiduciary, they say: "I\'m a registered rep, but I always do right by my clients." What do you do?',
    options: [
      { value: 'a', label: 'Trust them - they seem sincere and have good reviews', feedback: 'Dangerous! Sincerity doesn\'t change the legal standard. They\'re a broker with a conflict of interest — that 7% commission comes out of YOUR pocket.', isCorrect: false },
      { value: 'b', label: 'Ask for more details about the annuity\'s performance', feedback: 'Missing the point! Even if the annuity is decent, the 7% commission is an enormous conflict. No fiduciary would recommend this.', isCorrect: false },
      { value: 'c', label: 'Thank them and find a fee-only fiduciary advisor', feedback: 'Correct! This person is a broker, not a fiduciary. The 7% commission is a massive conflict. Find a fee-only advisor who has no financial incentive in what you choose.', isCorrect: true },
      { value: 'd', label: 'Buy the annuity but ask for a lower commission', feedback: 'Commissions are set by the product manufacturer, not the advisor. Even if they could reduce it, the fundamental conflict remains.', isCorrect: false },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'seven-questions',
    type: 'content',
    title: 'The 7 Questions to Ask Any Advisor',
    subtitle: 'Tony Robbins\' advisor vetting framework',
    content: `
      <p class="text-lg mb-6">Before you hire any financial advisor or invest in any product, ask these 7 questions. Their answers will reveal everything.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Question 1: Are you a fiduciary?</h2>
      <p class="text-gray-300 mb-4">We covered this in the previous section. If the answer isn't an immediate "Yes, always," end the conversation.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Question 2: How are you compensated?</h2>
      <p class="text-gray-300 mb-4">You need to know exactly how they get paid:</p>
      <div class="bg-dark-bg rounded-lg p-4 my-4 border border-dark-border">
        <ul class="text-gray-300 space-y-2">
          <li><strong>Fee-only:</strong> You pay them directly. No commissions. ✓</li>
          <li><strong>Fee-based:</strong> They charge fees BUT also accept commissions. ✗</li>
          <li><strong>Commission-only:</strong> They only make money when you buy/sell. ✗</li>
        </ul>
      </div>
      <p class="text-gray-400 text-sm">You want fee-only. Anything else involves conflicts of interest.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Question 3: What are ALL the fees I will pay?</h2>
      <p class="text-gray-300 mb-4">Ask for the TOTAL expense in percentage:</p>
      <div class="bg-dark-bg rounded-lg p-4 my-4 border border-dark-border">
        <p class="text-gray-300">Advisor fee + Fund expense ratios + Transaction fees + Account fees = <strong class="text-white">TOTAL COST</strong></p>
      </div>
      <p class="text-gray-400 text-sm">If they can't give you a single percentage, they're hiding something.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Question 4: Do you have a legal fiduciary duty to ALL my accounts?</h2>
      <p class="text-gray-300 mb-4">Trick question! Many advisors are fiduciaries for some accounts but not others.</p>
      <div class="bg-yellow-400/10 border-l-4 border-yellow-400 p-4 my-4 rounded-r-lg">
        <p class="text-gray-300">Example: They might be a fiduciary for your managed account but still sell commission products in your IRA. You need 100% fiduciary coverage, 100% of the time.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Question 5: What is your investment philosophy?</h2>
      <p class="text-gray-300 mb-4">Listen for these red flags:</p>
      <div class="bg-dark-bg rounded-lg p-4 my-4 border border-dark-border">
        <ul class="text-gray-300 space-y-2">
          <li>🚩 "We beat the market" (unlikely to be true)</li>
          <li>🚩 "We actively manage to find opportunities" (usually underperforms)</li>
          <li>🚩 "Our proprietary strategies" (often just high-fee products)</li>
        </ul>
      </div>
      <p class="text-green-400 text-sm mt-2">✓ Good answers: Passive investing, index funds, asset allocation focus, low fees.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Question 6: Will you have fiduciary duty to my account, or will a broker-dealer?</h2>
      <p class="text-gray-300 mb-4">Some advisors outsource your account to a third-party money manager. You want YOUR advisor to be the fiduciary, not some distant company you never talk to.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Question 7: Describe a typical client.</h2>
      <p class="text-gray-300 mb-4">You want to hear someone like you:</p>
      <div class="bg-dark-bg rounded-lg p-4 my-4 border border-dark-border">
        <ul class="text-gray-300 space-y-2">
          <li>Net worth similar to yours</li>
          <li>Life stage similar to yours</li>
          <li>Goals similar to yours</li>
        </ul>
      </div>
      <p class="text-gray-400 text-sm">If their "typical client" has $10M and you have $100k, you're not their priority.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal font-bold text-lg mb-2">The Golden Rule</h3>
        <p class="text-gray-200">If they get defensive, dodge questions, or use jargon you don't understand — walk away. A true fiduciary welcomes these questions.</p>
      </div>
    `,
  },
  {
    id: 'questions-quiz',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test your understanding of advisor questions',
    content: `
      <p class="text-lg mb-6">Check if you know what red flags to look for.</p>
    `,
    question: 'An advisor says: "I\'m fee-based, not fee-only." Is this a problem?',
    options: [
      { value: 'a', label: 'No - fee-based means they charge fees, which is good', feedback: 'Incorrect! "Fee-based" is code for "I charge fees AND accept commissions." There are conflicts of interest.', isCorrect: false },
      { value: 'b', label: 'Yes - fee-based means they can also earn commissions', feedback: 'Correct! Fee-based advisors have one foot in the fiduciary world and one foot in the broker world. You want fee-only.', isCorrect: true },
      { value: 'c', label: 'It depends - as long as they disclose the commissions', feedback: 'Incorrect! Disclosure doesn\'t eliminate the conflict. If they earn commissions, their incentives are misaligned with yours.', isCorrect: false },
      { value: 'd', label: 'Not sure - what\'s the difference?', feedback: 'This is exactly why the industry uses confusing language! Fee-only = advisor only. Fee-based = advisor + salesperson. The difference is massive.', isCorrect: false },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'conflicts-interest',
    type: 'content',
    title: 'Spotting Conflicts of Interest',
    subtitle: 'Hidden incentives that destroy wealth',
    content: `
      <p class="text-lg mb-6">Conflicts of interest are everywhere in the financial industry. Let's expose the most common ones.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Commission Trap</h2>
      <p class="text-gray-300 mb-4">When an advisor earns a commission for selling a product, their incentives are clear:</p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div class="bg-red-400/10 p-4 rounded border border-red-400/30">
          <h3 class="text-red-400 font-bold mb-2">High-Commission Products</h3>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>Annuities: 5-10% commission</li>
            <li>Loaded mutual funds: 3-5% commission</li>
            <li>Private placements: 7-15% commission</li>
            <li>Whole life insurance: 50-100% first-year commission</li>
          </ul>
        </div>
        <div class="bg-green-400/10 p-4 rounded border border-green-400/30">
          <h3 class="text-green-400 font-bold mb-2">Low-Commission Products</h3>
          <ul class="text-gray-300 text-sm space-y-1">
            <li>Index funds/ETFs: 0% commission</li>
            <li>Treasury bonds: 0% commission</li>
            <li>No-load mutual funds: 0% commission</li>
            <li>Fee-only accounts: No sales charges</li>
          </ul>
        </div>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-6 my-6">
        <p class="text-gray-200">Guess which products get recommended most often by commission-based advisors?</p>
        <p class="text-white font-bold mt-2">Hint: It's not the ones that are best for YOU.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The Revenue Sharing Scam</h2>
      <p class="text-gray-300 mb-4">Even "no-load" mutual funds have hidden conflicts. Many pay fund companies to be included in 401(k) menus — a practice called "revenue sharing."</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <p class="text-gray-300 mb-2">How it works:</p>
        <ol class="text-gray-300 list-decimal ml-4 space-y-2">
          <li>Fund Company B pays your 401(k) provider to include their funds</li>
          <li>Your 401(k) provider puts Fund Company B on the investment menu</li>
          <li>You invest in Fund Company B because it's available</li>
          <li>Higher fees are quietly deducted from your account</li>
          <li>Everyone profits except you</li>
        </ol>
        <p class="text-red-400 mt-4 text-sm">This is legal. This is common. This costs investors billions.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">The 401(k) Trap</h2>
      <p class="text-gray-300 mb-4">Your employer's 401(k) may be filled with high-fee funds. Why?</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <ul class="text-gray-300 space-y-2">
          <li>💰 Your employer chose the plan administrator based on cost (to the company)</li>
          <li>💰 The plan administrator offers funds that pay them revenue sharing</li>
          <li>💰 Your employer doesn't pay attention to fund fees</li>
          <li>💰 You assume the funds are good because they're offered</li>
        </ul>
        <p class="text-primary-teal mt-4 font-semibold">Solution: Check the expense ratios of ALL funds in your 401(k). Choose the lowest-cost index funds available.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Defense First Strategy</h2>
      <p class="text-gray-300 mb-4">Instead of chasing returns, focus on avoiding losses. The best defense against conflicts of interest:</p>

      <div class="bg-green-400/10 border-l-4 border-green-400 p-6 my-6 rounded-r-lg">
        <ol class="text-gray-300 space-y-3">
          <li><strong>1. Work with a fee-only fiduciary</strong> — No commissions, no sales pressure</li>
          <li><strong>2. Use low-cost index funds</strong> — Eliminate manager risk and high fees</li>
          <li><strong>3. Understand ALL fees</strong> — Ask for total costs in one percentage</li>
          <li><strong>4. Never buy from a salesperson</strong> — If they're selling, you're probably buying something you don't need</li>
          <li><strong>5. Keep it simple</strong> — Complex products are designed to generate fees, not returns</li>
        </ol>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal font-bold text-lg mb-2">The Ultimate Defense</h3>
        <p class="text-gray-200">If you can't explain it to a 12-year-old in 2 minutes, don't invest in it. Complexity is the enemy of returns.</p>
      </div>
    `,
  },
  {
    id: '401k-scenario',
    type: 'scenario',
    title: 'Real-World Decision',
    subtitle: 'Apply what you\'ve learned',
    scenario: 'You\'re reviewing your 401(k) investment options. Your plan offers:\n\nOption A: Target Date 2055 Fund\n- Expense ratio: 0.75%\n- Automatically adjusts allocation\n- Convenient "set it and forget it"\n\nOption B: S&P 500 Index Fund\n- Expense ratio: 0.02%\n- 100% stocks\n- You\'d need to manage allocation yourself\n\nThe difference: 0.73% per year in fees. Over 35 years, this difference could cost you over $200,000 on a $100,000 starting balance.',
    question: 'What do you choose?',
    options: [
      { value: 'target', label: 'Choose Target Date Fund - convenience is worth the extra cost', feedback: 'Understandable preference, but expensive. That 0.73% fee difference compounds to $200,000+ over your career. Learning basic allocation takes a few hours and saves a fortune.', isCorrect: false },
      { value: 'index', label: 'Choose S&P 500 Index Fund - keep more of your money', feedback: 'Correct! The fee difference of 0.73% means hundreds of thousands more in retirement. You can learn to rebalance once a year in about 30 minutes. That\'s a great hourly rate!', isCorrect: true },
      { value: 'split', label: 'Split 50/50 between both - get the best of both worlds', feedback: 'Better than 100% Target Date, but you\'re still paying high fees on half your money. Consider 100% low-cost index funds and learn basic allocation.', isCorrect: false },
      { value: 'ask', label: 'Ask HR to add better low-cost options', feedback: 'Excellent idea! But this could take months or never happen. In the meantime, use the best available option (S&P 500 Index) and advocate for change.', isCorrect: false },
    ],
    correctAnswer: 'index',
  },
  {
    id: 'reflection',
    type: 'reflection',
    title: 'Personal Execution Reflection',
    subtitle: 'Audit your financial relationships',
    content: `
      <p class="text-lg mb-6">You've learned how to spot conflicts and find trustworthy advisors. Now let's audit YOUR situation.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Reflect on These Questions:</h2>

      <div class="space-y-4 mb-6">
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">1. Advisor Audit</h3>
          <p class="text-gray-300">Do you currently work with a financial advisor? Are they a fiduciary? How are they compensated? Have you asked the 7 Questions?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">2. Fee Audit</h3>
          <p class="text-gray-300">What is the total expense ratio of all your investments? (Check 401k, IRA, brokerage accounts). Are you paying more than 0.5% total?</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">3. Conflict Check</h3>
          <p class="text-gray-300">Have you been sold products (annuities, loaded funds, permanent life insurance)? Did you understand the commission structure at the time?</p>
        </div>
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">4. Action Plan</h3>
          <p class="text-gray-300">What changes will you make? (Find a fee-only advisor, switch to low-cost funds, ask the 7 Questions)</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Your Commitment:</h2>
      <p class="text-gray-300 mb-4">Write down one specific action you'll take in the next 30 days to protect your wealth from conflicts of interest:</p>
    `,
  },
  {
    id: 'complete',
    type: 'content',
    title: 'Module 4 Complete!',
    subtitle: 'You are equipped to invest and advise wisely',
    content: `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-primary-teal mb-4">Congratulations!</h2>
        <p class="text-xl text-gray-200">You've completed Module 4: Execution</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">Key Takeaways:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>Brokers and fiduciaries are fundamentally different</li>
          <li>The 7 Questions reveal an advisor's true incentives</li>
          <li>Conflicts of interest are everywhere — know how to spot them</li>
          <li>Defense First strategy protects your wealth from predators</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-xl font-bold text-white mb-4">What's Next:</h3>
        <p class="text-gray-300 mb-4">You know how to execute wisely. Now it's time to master the final piece: long-term psychology.</p>

        <p class="text-gray-300 mb-4">In <strong>Module 5: Mastery</strong>, you'll discover:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-400">
          <li>The Seven Freedom Facts about markets</li>
          <li>Bear market navigation strategies</li>
          <li>Missing the best days - the real cost</li>
          <li>Psychological mastery for long-term success</li>
        </ul>
      </div>

      <div class="text-center mt-8">
        <p class="text-gray-400 italic">Your progress has been saved. One more module to achieve financial mastery!</p>
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

export default function Module4_Execution() {
  const navigate = useNavigate();
  const { startModule, recordScreenProgress, completeModule, saveReflection, reflections } = useTrainingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reflectionResponse, setReflectionResponse] = useState('');
  const currentScreenData = MODULE_4_SCREENS[currentIndex];
  const totalScreens = MODULE_4_SCREENS.length;
  const moduleId = 'module-4-execution';

  useEffect(() => { startModule(moduleId); }, [moduleId, startModule]);

  /**
   * Load saved reflection when reflection screen is displayed
   */
  useEffect(() => {
    if (currentScreenData.type === 'reflection') {
      const savedReflection = reflections['module-4-reflection']?.response;
      if (savedReflection) {
        setReflectionResponse(savedReflection);
      }
    }
  }, [currentScreenData.type, reflections]);

  const handleAnswerSelect = (answer: string) => { setSelectedAnswer(answer); setShowFeedback(true); };

  const handleReflectionSubmit = () => {
    saveReflection('module-4-reflection', reflectionResponse);
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

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePsychologyStore } from '../../stores';
import { formatTrainingContent } from '../../lib/utils/formatTraining';

interface Screen {
  id: string;
  type: 'content' | 'reflection' | 'scenario' | 'summary';
  title?: string;
  content: string;
  options?: { value: string; label: string; feedback?: string }[];
  correctAnswer?: string;
}

const screens: Screen[] = [
  {
    id: 'intro',
    type: 'content',
    title: 'Financial Fundamentals',
    content: `
Welcome to Financial Fundamentals! In this module, you'll master the essential concepts that underpin all financial planning.

**What you'll learn:**
• Why compound interest is called the "eighth wonder of the world"
• How inflation silently destroys wealth — and how to beat it
• What net worth actually measures (and why it matters)
• The crucial difference between assets and liabilities
• How the Three Buckets strategy balances security and growth

**Time:** 10-12 minutes

These concepts are the foundation for the Blueprint Assessment and all future financial decisions.
    `,
  },
  {
    id: 'why-financial-literacy',
    type: 'content',
    title: 'Why Financial Literacy Matters',
    content: `
Financial literacy isn't just about numbers — it's about freedom and security.

**The cost of being uneducated:**
• The average person loses thousands to fees, poor decisions, and missed opportunities
• Without literacy, you rely on others' advice (who may have conflicts of interest)
• Financial stress damages health, relationships, and quality of life
• You can't achieve goals you don't know how to reach

**The good news:** Financial literacy is learnable. It's not a talent you're born with — it's a set of concepts anyone can master. This module gives you those concepts.

**The payoff:** Every financial decision you make — from saving to investing to borrowing — becomes clearer and more confident.
    `,
  },
  {
    id: 'compound-interest',
    type: 'content',
    title: 'Compound Interest: The Eighth Wonder',
    content: `
Albert Einstein reportedly called compound interest "the eighth wonder of the world" and "the most powerful force in the universe."

**What it is:** Compound interest means you earn interest on your interest. Money grows exponentially, not linearly.

**The math:** If you invest $10,000 at 7% annual return:
• After 1 year: $10,700
• After 10 years: $19,672
• After 20 years: $38,697
• After 30 years: $76,123

**The key insight:** Your money more than doubles every 10 years at 7% return. Time is your biggest ally.

**The rule of 72:** Divide 72 by your return rate to see how long it takes to double. At 7%, money doubles in about 10 years. At 10%, it doubles in 7.2 years.

**The lesson:** Start investing early, even with small amounts. Time in the market beats timing the market.
    `,
  },
  {
    id: 'scenario-1',
    type: 'scenario',
    title: 'Scenario: The Cost of Waiting',
    content: `
Two friends, Alex and Jordan, both want to retire with $500,000.

**Alex** starts investing $300/month at age 25 and earns 7% annually.
**Jordan** waits until age 35 to start investing $300/month at 7% annually.

Both invest until age 65. What happens?

**Guess the outcome:**`,
    options: [
      { value: 'a', label: 'Jordan ends up with slightly less (within 20% of Alex)', feedback: 'Close, but the difference is much larger. The 10-year head start compounds dramatically.' },
      { value: 'b', label: 'Jordan ends up with about half of what Alex has', feedback: 'Correct! Alex ends up with ~$720,000 while Jordan has ~$340,000. Waiting 10 years cuts the final result roughly in half, even though Jordan invested for 30 years!' },
      { value: 'c', label: 'They end up with about the same amount', feedback: 'Not true. Compound interest means starting earlier has a massive impact. Alex\'s money had 10 extra years to compound.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'inflation',
    type: 'content',
    title: 'Inflation: The Silent Wealth Destroyer',
    content: `
Inflation is the rate at which money loses purchasing power over time. It's like a hidden tax on your savings.

**Historical context:** Inflation averages about 3% per year in the US. This means:
• Prices double roughly every 24 years
• $100 today buys what $50 bought 24 years ago
• Your money must earn at least 3% annually just to maintain purchasing power

**The impact on your life:**
• If you save cash under a mattress, you're guaranteed to lose purchasing power
• Retirement planning MUST account for inflation — or you'll run out of money
• Wages must keep pace with inflation, or your standard of living declines

**The solution:** Invest in assets that historically outpace inflation:
• Stocks (average ~7-10% annually before inflation)
• Real estate
• Certain bonds (Treasury Inflation-Protected Securities)

**The lesson:** Holding cash feels safe, but it's guaranteed to lose value. Investing feels risky, but it's the only way to preserve purchasing power.
    `,
  },
  {
    id: 'net-worth',
    type: 'content',
    title: 'Net Worth: Your True Financial Score',
    content: `
Net worth is the single most important measure of your financial health. It's simple but powerful.

**The formula:**
Net Worth = Total Assets − Total Liabilities

**Assets include:**
• Cash and bank accounts
• Retirement accounts (401k, IRA)
• Investment accounts
• Real estate (primary home, rental properties)
• Business ownership
• Personal property (cars, jewelry — though these depreciate)

**Liabilities include:**
• Mortgage balance
• Credit card debt
• Student loans
• Auto loans
• Personal loans
• Any other money you owe

**Why it matters:**
• Income can be high but net worth low (high earners living paycheck to paycheck)
• Net worth measures cumulative financial decisions over your lifetime
• It's the scorecard for financial freedom (when net worth × 4% = annual expenses, you're financially independent)

**Tracking net worth:** Calculate it quarterly. The trend matters more than the number.
    `,
  },
  {
    id: 'reflection-1',
    type: 'reflection',
    title: 'Reflection: Estimate Your Net Worth',
    content: `
Based on what you know right now (without checking every account), estimate your current net worth.

**Consider:**
• Rough balance in checking/savings
• Retirement account balances
• Value of your home (if you own)
• Mortgage balance
• Other debts (credit cards, student loans, car loans)

**Your estimated net worth:** $`,
  },
  {
    id: 'assets-vs-liabilities',
    type: 'content',
    title: 'Assets vs. Liabilities: The Crucial Distinction',
    content: `
Robert Kiyosaki (author of "Rich Dad Poor Dad") popularized a simple definition that changed how millions think about money:

**Asset:** Something that puts money in your pocket
**Liability:** Something that takes money out of your pocket

**Examples:**
• **Rental property** = Asset (generates rental income)
• **Your home** = Liability (mortgage, taxes, insurance, maintenance — no income)
• **Stocks** = Asset (dividends + growth)
• **Car** = Liability (depreciation, gas, insurance, repairs — no income)

**The traditional definition vs. Kiyosaki's:**
Traditional accounting calls your home an asset. Kiyosaki calls it a liability. Why? Because it takes money out of your pocket every month.

**The insight:** A house can be both — it's a liability while you pay the mortgage, but becomes an asset if you rent it out or sell it for profit.

**The lesson:** Don't buy things thinking they're "investments" if they don't generate income. Focus on acquiring true assets.
    `,
  },
  {
    id: 'scenario-2',
    type: 'scenario',
    title: 'Scenario: Asset or Liability?',
    content: `
For each item, choose whether it's an asset or liability based on Kiyosaki's definition (does it put money in or take money out?):

**1. A vacation home you use 2 weeks/year and rent out the rest of the time**

**2. A brand new car you financed**

**3. Your primary residence**

**4. Dividend-paying stocks in a brokerage account**`,
    options: [
      { value: 'a', label: '1: Asset, 2: Liability, 3: Asset, 4: Liability', feedback: 'Partially correct. A vacation home that generates rental income is an asset. A car is a liability. But a primary residence takes money out, so it\'s a liability. And dividend stocks put money in, so they\'re an asset.' },
      { value: 'b', label: '1: Asset, 2: Liability, 3: Liability, 4: Asset', feedback: 'Correct! The vacation home and stocks generate income (assets). The car and primary residence cost money monthly (liabilities). This clarity helps you make better decisions about where to put your money.' },
      { value: 'c', label: '1: Liability, 2: Asset, 3: Liability, 4: Asset', feedback: 'Not quite. A vacation home that rents out generates income, making it an asset. A car doesn\'t generate income (liability). The primary residence costs money (liability). Dividend stocks generate income (asset).' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'three-buckets',
    type: 'content',
    title: 'The Three Buckets Strategy',
    content: `
The book "Money Master the Game" advocates a simple asset allocation framework: divide your investments into three buckets based on purpose and risk.

**Bucket 1: Security (The "Sleep Well" Bucket)**
• Purpose: Protect against worst-case scenarios
• Investments: Cash, CDs, government bonds
• Target: Enough to cover 6-12 months of expenses
• Risk: Very low
• Return: Low (2-4%)

**Bucket 2: Growth (The "Build Wealth" Bucket)**
• Purpose: Long-term growth to build wealth
• Investments: Diversified stock index funds, real estate
• Target: Largest portion of your portfolio
• Risk: Medium-high (market volatility)
• Return: Medium-high (7-10% average)

**Bucket 3: Dream (The "Enjoy Life" Bucket)**
• Purpose: Fund your dream lifestyle and experiences
• Investments: Higher-growth opportunities, business, speculative investments
• Target: 5-10% of portfolio
• Risk: High
• Return: Variable (could lose everything, could 10x)

**The key:** All three buckets are necessary. Security gives you peace. Growth builds your future. Dreams make life worth living.
    `,
  },
  {
    id: 'diversification',
    type: 'content',
    title: 'Diversification: Don\'t Put All Eggs in One Basket',
    content: `
Diversification is the practice of spreading your investments across different types of assets to reduce risk.

**Why it works:** Different investments perform differently in different conditions. When stocks fall, bonds may rise. When US markets struggle, international may grow.

**Types of diversification:**
• **Asset classes:** Stocks, bonds, real estate, cash
• **Geography:** US, international, emerging markets
• **Industries:** Tech, healthcare, energy, finance
• **Company size:** Large-cap, mid-cap, small-cap
• **Style:** Growth vs. value stocks

**The benefit:** You capture market returns with lower volatility. If one investment fails, it doesn't devastate your portfolio.

**The simplest approach:** A low-cost index fund that tracks the entire stock market (like the S&P 500 or Total Stock Market) gives you instant diversification across hundreds of companies.

**The lesson:** Don't try to pick winning stocks or time the market. Diversify broadly, hold for the long term, and let the market work for you.
    `,
  },
  {
    id: 'reflection-2',
    type: 'reflection',
    title: 'Reflection: Your Investment Strategy',
    content: `
Based on what you've learned about the Three Buckets and diversification:

**Which bucket do you currently focus on most?**
**Which bucket needs more attention?**

**What's one action you can take this month to improve your asset allocation?**

**Your commitment:**`,
  },
  {
    id: 'summary',
    type: 'summary',
    title: 'Module Complete!',
    content: `
**Congratulations!** You've completed the Financial Fundamentals module.

**Key takeaways:**
• Compound interest is powerful — start early, be consistent
• Inflation destroys purchasing power — invest to beat it
• Net worth is your true financial score — track it quarterly
• Assets put money in your pocket; liabilities take it out
• The Three Buckets balance security, growth, and dreams
• Diversification reduces risk while capturing returns

**What's next:**
Now you'll assess your current financial knowledge and habits with the Blueprint Assessment. This comprehensive evaluation covers psychology, economics, sophistication, and execution.

*Your reflection responses have been saved. You can review them anytime from your profile.*
    `,
  },
];

export default function FinancialTrainingModule() {
  const navigate = useNavigate();
  const { setTrainingProgress, setReflectionResponse, reflectionResponses } = usePsychologyStore();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const screen = screens[currentScreen];
  const isLastScreen = currentScreen === screens.length - 1;
  const progress = ((currentScreen + 1) / screens.length) * 100;

  const handleNext = () => {
    if (isLastScreen) {
      setTrainingProgress('financialModule', true);
      navigate('/assessments/blueprint');
    } else {
      setCurrentScreen(currentScreen + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen(currentScreen - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      navigate('/training/hub');
    }
  };

  const handleSkipToHub = () => {
    navigate('/training/hub');
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    setShowFeedback(true);
  };

  const handleReflectionSubmit = (value: string) => {
    setReflectionResponse(screen.id, value);
    setTimeout(() => handleNext(), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Screen {currentScreen + 1} of {screens.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-dark-bg rounded-full h-2">
            <div
              className="bg-primary-purple h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-dark-surface border border-dark-border rounded-lg p-8">
          {/* Header */}
          {screen.title && (
            <h1 className="text-3xl font-bold text-white mb-6">{screen.title}</h1>
          )}

          {/* Content */}
          {screen.type === 'reflection' ? (
            <ReflectionInput
              screen={screen}
              existingValue={reflectionResponses[screen.id]}
              onSubmit={handleReflectionSubmit}
            />
          ) : (
            <div className="prose prose-invert max-w-none">
              {formatTrainingContent(screen.content)}

              {/* Scenario Options */}
              {screen.type === 'scenario' && screen.options && (
                <div className="mt-8 space-y-3">
                  {screen.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswerSelect(option.value)}
                      disabled={showFeedback}
                      className={`w-full text-left px-6 py-4 rounded-lg border transition-all ${
                        selectedAnswer === option.value
                          ? showFeedback && option.value === screen.correctAnswer
                            ? 'bg-green-400/20 border-green-400'
                            : showFeedback
                            ? 'bg-red-400/20 border-red-400'
                            : 'bg-primary-purple/20 border-primary-purple'
                          : 'bg-dark-bg border-dark-border hover:border-primary-purple'
                      } ${showFeedback ? 'cursor-default' : 'hover:bg-primary-purple/10'}`}
                    >
                      <span className="text-gray-200 font-semibold">{option.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Feedback */}
              {showFeedback && selectedAnswer && screen.options && (
                <div className={`mt-6 p-4 rounded-lg border ${
                  selectedAnswer === screen.correctAnswer
                    ? 'bg-green-400/10 border-green-400/30'
                    : 'bg-red-400/10 border-red-400/30'
                }`}>
                  <p className="text-gray-300">
                    {screen.options.find(o => o.value === selectedAnswer)?.feedback}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          {screen.type !== 'reflection' && (
            <div className="flex flex-col gap-4 mt-8">
              <div className="flex justify-between items-center">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
                >
                  ← Back
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg bg-primary-purple hover:bg-purple-600 text-white font-semibold transition-colors"
                >
                  {isLastScreen ? 'Begin Blueprint Assessment →' : 'Continue →'}
                </button>
              </div>
              {!isLastScreen && (
                <div className="text-center">
                  <button
                    onClick={handleSkipToHub}
                    className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors"
                  >
                    Return to Training Hub
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReflectionInput({
  screen,
  existingValue,
  onSubmit,
}: {
  screen: Screen;
  existingValue?: string;
  onSubmit: (value: string) => void;
}) {
  const [value, setValue] = useState(existingValue || '');

  return (
    <div>
      {formatTrainingContent(screen.content)}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type your reflection here..."
        className="w-full h-32 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-primary-purple focus:outline-none resize-none"
      />
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => onSubmit(value)}
          className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
        >
          ← Back
        </button>
        <button
          onClick={() => onSubmit(value)}
          className="px-6 py-3 rounded-lg bg-primary-purple hover:bg-purple-600 text-white font-semibold transition-colors"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}

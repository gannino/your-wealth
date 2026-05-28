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
    title: 'Assessment Mastery',
    content: `
Welcome to Assessment Mastery! This final module ensures you get the most accurate and useful results from the upcoming questionnaires.

**What you'll learn:**
• Why assessments are the foundation of your financial plan
• How the 1-5 scale works and what each answer means
• Why honesty beats optimism when answering questions
• How to interpret your four category scores
• How to use your results to guide your journey

**Time:** 8-10 minutes

Your assessment results will personalize your entire experience, so it's worth understanding how to approach them thoughtfully.
    `,
  },
  {
    id: 'why-assessments',
    type: 'content',
    title: 'Why Assessments Matter',
    content: `
You might wonder: "Why can't I just jump to the financial planning tools?" Here's why assessments come first:

**You can't improve what you don't measure**
• Assessments establish your baseline — where you're starting from
• Without a baseline, you can't track progress
• What gets measured gets managed

**Personalization requires understanding**
• Your financial plan should match YOUR psychology, knowledge, and habits
• Generic advice fails because it doesn't account for your specific situation
• Assessment results guide which tools and strategies will work best for you

**Blind spots are dangerous**
• Everyone has gaps in their financial knowledge
• We're bad at judging our own abilities (the Dunning-Kruger effect)
• Assessments reveal what you don't know you don't know

**The goal:** Not to judge you, but to meet you where you are. Honesty in assessments leads to better recommendations and faster progress.
    `,
  },
  {
    id: 'how-questions-work',
    type: 'content',
    title: 'How Questions Work: The 1-5 Scale',
    content: `
All assessment questions use a 1-5 scale. Understanding this scale is crucial for accurate results.

**The Scale:**
1 = Strongly Disagree
2 = Disagree
3 = Neutral
4 = Agree
5 = Strongly Agree

**Important notes:**

**Neutrality is valid:** It's okay to choose 3 if you genuinely don't have an opinion or the statement doesn't apply. Don't force an agreement or disagreement.

**Avoid the middle when you have an opinion:** If you lean slightly toward agreement, choose 4. Only use 3 when truly neutral. The scale is designed to capture nuance — use it.

**Strongly doesn't mean emotionally:** "Strongly Agree" doesn't mean you're emotional about it. It means the statement is very true for you. "Strongly Disagree" means the statement is very false for you.

**Speed matters:** Trust your first instinct. Overthinking leads to second-guessing, which reduces accuracy.
    `,
  },
  {
    id: 'scenario-1',
    type: 'scenario',
    title: 'Scenario: What Does Strongly Agree Mean?',
    content: `
Question: "I regularly review my finances."

You check your bank account once a month and look at your retirement account balance once a year. You don't have a budget or track expenses.

**What do you answer?**`,
    options: [
      { value: 'a', label: 'Strongly Agree (5) — I do review sometimes, which is regular', feedback: 'Not quite. "Regularly" implies a consistent, systematic review. Once a year isn\'t regular. A more honest answer would be Disagree or Neutral.' },
      { value: 'b', label: 'Neutral (3) — I review sometimes but not consistently', feedback: 'Better. But consider: "Regularly" suggests frequency and consistency. Once a month for checking isn\'t really "reviewing finances" in the sense the question means. Disagree might be more accurate.' },
      { value: 'c', label: 'Disagree (2) — My review is sporadic, not regular or systematic', feedback: 'Most accurate. The question asks about regularly reviewing — meaning consistent, intentional examination. Checking your balance occasionally isn\'t the same as reviewing finances. Honesty helps you identify growth areas.' },
    ],
    correctAnswer: 'c',
  },
  {
    id: 'being-honest',
    type: 'content',
    title: 'Being Honest with Yourself',
    content: `
The temptation when taking assessments is to answer how you WISH things were, not how they actually are. This is human nature — but it sabotages your results.

**The optimism trap:**
• "I'm going to start budgeting soon" → You mark "I have a budget" (Disagree with reality)
• "I know I should track expenses" → You mark "I track expenses" (aspirational answering)
• "I plan to learn about investing" → You mark "I understand investing" (future fact as current truth)

**Why this hurts you:**
• Your results will show you're doing better than you actually are
• You won't get recommendations for areas you actually need to improve
• You'll miss the opportunity to identify genuine strengths and weaknesses

**The reframe:**
• Low scores aren't failures — they're information
• "I don't have a budget" is a starting point, not a judgment
• Honest answers give you a baseline to measure improvement
• The goal is progress, not perfection

**The practice:** Answer based on CURRENT reality, not FUTURE intentions. If you don't have a budget today, say so. You can always retake assessments later and celebrate your progress.
    `,
  },
  {
    id: 'reflection-1',
    type: 'reflection',
    title: 'Reflection: Your Honest Baseline',
    content: `
Think about your financial habits and knowledge.

**In what areas are you tempted to answer based on aspirations rather than reality?**

**Examples:**
• Budgeting (I plan to start...)
• Investing (I'm going to learn...)
• Net worth (I think it's around...)

**What would it look like to answer these questions with complete honesty about your CURRENT situation?**

**Your commitment to honesty:**
    `,
  },
  {
    id: 'psychology-score',
    type: 'content',
    title: 'Understanding Your Psychology Score',
    content: `
The Psychology category measures your money mindset, emotional patterns, and beliefs.

**What a high score means (8-10):**
• You generally have an empowering relationship with money
• You make decisions thoughtfully, not emotionally
• You believe wealth is attainable and you have agency
• You've done work on your money story

**What a low score means (1-5):**
• Limiting beliefs may be influencing your decisions
• Money emotions (fear, guilt, anxiety) drive choices
• You may feel powerless or confused about finances
• You haven't examined your money story

**What to do with your score:**
• **High score:** Great foundation! Share your mindset with others. Still watch for blind spots.
• **Medium score (6-7):** Solid but room to grow. Identify which specific beliefs or emotions hold you back.
• **Low score:** Opportunity! The psychology assessment is designed exactly for this. Transformation is possible.

**Remember:** Your psychology is not fixed. It's learned, and anything learned can be unlearned and replaced with something better.
    `,
  },
  {
    id: 'economics-score',
    type: 'content',
    title: 'Understanding Your Economics Score',
    content: `
The Economics category measures your financial literacy — understanding of key concepts and current financial situation awareness.

**What a high score means (8-10):**
• You understand core concepts (compound interest, inflation, diversification)
• You know your current financial numbers (net worth, expenses, income)
• You can explain financial concepts to others
• You make informed decisions

**What a low score means (1-5):**
• You may not understand key financial concepts
• You might not know your current financial situation
• Financial decisions feel confusing or overwhelming
• You rely on others' advice without understanding it

**What to do with your score:**
• **High score:** Use your knowledge! Consider teaching others (which reinforces your learning). Watch for overconfidence.
• **Medium score (6-7):** Good foundation but gaps exist. The Financial Fundamentals module will help fill them.
• **Low score:** Perfect candidate for training! Financial literacy is learnable. Start with basics and build systematically.

**The opportunity:** Low economics scores aren't permanent — they're a call to education. Every financially successful person started with zero knowledge.
    `,
  },
  {
    id: 'sophistication-score',
    type: 'content',
    title: 'Understanding Your Sophistication Score',
    content: `
The Sophistication category measures your investment knowledge and strategy sophistication.

**What a high score means (8-10):**
• You understand different asset classes and investment types
• Your portfolio is diversified, not concentrated
• You understand fees, expense ratios, and tax implications
• You have a long-term strategy and don't panic during volatility

**What a low score means (1-5):**
• You may not understand different investment types
• Your investments might be concentrated (all in one stock or fund)
• You might not know what fees you're paying
• Market volatility makes you anxious

**What to do with your score:**
• **High score:** Stay disciplined. Avoid overconfidence. Keep learning.
• **Medium score (6-7):** Diversify more. Learn about fees. Build a long-term strategy.
• **Low score:** Start simple. Index funds are perfect for beginners. Focus on time in the market, not timing the market.

**The insight:** Sophistication doesn't mean complexity. The most sophisticated investors often use the simplest strategies — diversified index funds held for decades.
    `,
  },
  {
    id: 'execution-score',
    type: 'content',
    title: 'Understanding Your Execution Score',
    content: `
The Execution category measures action-taking — how consistently you apply financial knowledge.

**What a high score means (8-10):**
• You automate savings and investments
• You pay yourself first
• You review finances regularly (at least monthly)
• You take action promptly on financial decisions
• You have multiple income streams

**What a low score means (1-5):**
• You intend to take action but don't follow through
• Financial tasks feel overwhelming or get postponed
• You don't automate good financial habits
• You know what you should do but don't do it

**The knowledge-action gap:**
This is the most common problem: people who know what to do but don't do it. High Economics + low Execution = frustration.

**What to do with your score:**
• **High score:** Keep going! You're building momentum. Help others who struggle with execution.
• **Medium score (6-7):** Identify friction points. What stops you from acting? Automate more.
• **Low score:** Start small. Automate ONE thing (savings transfer). Build the habit first, worry about amounts later.

**The truth:** Execution beats knowledge every time. Someone who saves $100/month consistently beats someone who knows sophisticated strategies but never acts.
    `,
  },
  {
    id: 'scenario-2',
    type: 'scenario',
    title: 'Scenario: Interpreting Your Scores',
    content: `
You've completed the Blueprint Assessment and received these scores:

• Psychology: 5/10
• Economics: 8/10
• Sophistication: 4/10
• Execution: 3/10

**What's your priority?**`,
    options: [
      { value: 'a', label: 'Focus on Sophistication — it\'s your lowest score', feedback: 'Not necessarily. Your Execution score is even lower, and the knowledge-action gap is your biggest problem. You understand finances (Economics 8) but don\'t act on it (Execution 3).' },
      { value: 'b', label: 'Focus on Execution — close the knowledge-action gap', feedback: 'Exactly! You understand finances (Economics 8) but don\'t act on it (Execution 3). Automate savings, set up regular transfers, and build systems that make good habits automatic.' },
      { value: 'c', label: 'Focus on Psychology — your mindset needs work', feedback: 'Psychology (5) does need attention, but your biggest issue is Execution. You know what to do but don\'t do it. Start with systems and automation, then address mindset.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'reflection-2',
    type: 'reflection',
    title: 'Reflection: Your Assessment Approach',
    content: `
**What have you learned about how to approach the upcoming assessments?**

**Consider:**
• Will you answer based on current reality or future aspirations?
• How will you resist the temptation to "look good" on the scores?
• What will you do if you get a low score in an area?

**Write your commitment to honest, useful assessment-taking:**

    `,
  },
  {
    id: 'summary',
    type: 'summary',
    title: 'Module Complete!',
    content: `
**Congratulations!** You've completed all three training modules.

**What you've mastered:**
• **Mindset & Psychology:** Your money story, limiting beliefs, and how to transform them
• **Financial Fundamentals:** Compound interest, inflation, net worth, assets vs. liabilities, the Three Buckets
• **Assessment Mastery:** How to take assessments honestly and interpret your results

**You're ready for:**
• Accurate, useful assessment results
• Personalized recommendations based on YOUR actual situation
• A financial plan that matches your psychology, knowledge, and habits

**Remember:**
• Your scores are information, not judgment
• Low scores identify opportunities, not failures
• Honest answers lead to better recommendations

**What's next:**
Now you'll enter your financial data to generate your personalized wealth plan. You'll set your currency, then provide information about income, assets, liabilities, and expenses.

*All your reflection responses have been saved. You can review them anytime from your profile.*
    `,
  },
];

export default function AssessmentTrainingModule() {
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
      setTrainingProgress('assessmentModule', true);
      navigate('/assessments/currency');
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
              className="bg-primary-pink h-2 rounded-full transition-all duration-300"
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
                            : 'bg-primary-pink/20 border-primary-pink'
                          : 'bg-dark-bg border-dark-border hover:border-primary-pink'
                      } ${showFeedback ? 'cursor-default' : 'hover:bg-primary-pink/10'}`}
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
                  className="px-6 py-3 rounded-lg bg-primary-pink hover:bg-pink-600 text-white font-semibold transition-colors"
                >
                  {isLastScreen ? 'Enter Financial Data →' : 'Continue →'}
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
        className="w-full h-32 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-primary-pink focus:outline-none resize-none"
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
          className="px-6 py-3 rounded-lg bg-primary-pink hover:bg-pink-600 text-white font-semibold transition-colors"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}

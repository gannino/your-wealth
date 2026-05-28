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
    title: 'Welcome to Mindset & Psychology',
    content: `
In this module, you'll discover how your beliefs about money shape every financial decision you make.

**What you'll learn:**
• The 80/20 principle and why psychology drives results
• How your money story was formed
• How to identify and transform limiting beliefs
• The mindset shifts that create lasting wealth

**Time:** 10-12 minutes
    `,
  },
  {
    id: '80-20',
    type: 'content',
    title: 'The 80/20 Principle',
    content: `
The book "Money Master the Game" teaches that success in any area follows a simple rule: **80% psychology, 20% mechanics**.

**What this means:**
• Your beliefs, emotions, and decisions drive 80% of your results
• Strategies, tactics, and tools account for only 20%
• You can have the best investment strategy, but if your psychology is wrong, you'll sabotage your results

**The trap:** Most people focus 100% on the mechanics — which stocks to buy, which app to use, which budget template to download. Meanwhile, their unconscious beliefs about money are steering them off course.

**The truth:** Lasting financial transformation starts from the inside out. Change your psychology, and the right mechanics become obvious and easy to apply.
    `,
  },
  {
    id: 'money-story',
    type: 'content',
    title: 'Your Money Story',
    content: `
Every person has a "money story" — a collection of beliefs, memories, and emotional patterns formed primarily in childhood.

**How your story was written:**
• What your parents said about money ("We can't afford that," "Money is the root of all evil")
• How your family handled financial stress (arguments, silence, avoidance)
• Early experiences with lack or abundance
• Cultural and religious messages about wealth

**The problem:** Most of this story runs on autopilot in your unconscious mind. You make financial decisions based on beliefs you didn't choose and may not even know you have.

**The opportunity:** When you become aware of your money story, you can rewrite it. You get to choose which beliefs serve you and which need to be transformed.

*Reflection: What's one thing your parents said about money that you still hear in your head?*
    `,
  },
  {
    id: 'limiting-beliefs',
    type: 'content',
    title: 'Identifying Limiting Beliefs',
    content: `
Limiting beliefs are unconscious assumptions that hold you back. They feel like facts, but they're actually stories you can change.

**Common limiting beliefs about money:**
• "I'm just not good with money"
• "Rich people are greedy/happy/lucky" (fill in the stereotype)
• "I'll never be wealthy because I didn't [go to college/start young/have connections]"
• "It's selfish to want to be wealthy when others are struggling"
• "I don't deserve to be wealthy"

**How they work:** Limiting beliefs create self-fulfilling prophecies. If you believe you're bad with money, you won't educate yourself, so you'll continue making poor decisions, which reinforces the belief.

**The first step:** Simply noticing these thoughts is powerful. When you catch yourself saying "I can't afford that" or "I'm not lucky," pause and ask: "Is that absolutely true?"
    `,
  },
  {
    id: 'scenario-1',
    type: 'scenario',
    title: 'Scenario: Your Inner Voice',
    content: `
You're considering enrolling in a course that could advance your career and earning potential. The cost is $2,000. Immediately, you hear an inner voice say:

*"I'll never be wealthy because I'm not smart enough to make good investments."*

**What is this voice telling you about your money story?*`,
    options: [
      { value: 'a', label: 'This is a fact about my abilities', feedback: 'This feels like a fact, but it\'s actually a belief. Abilities can be developed. Many successful investors started with zero knowledge.' },
      { value: 'b', label: 'This is a limiting belief I learned somewhere', feedback: 'Exactly! This belief likely came from somewhere — a childhood experience, something someone said, or early failures. The good news: if you learned it, you can unlearn it.' },
      { value: 'c', label: 'This is my intuition protecting me from risk', feedback: 'Intuition guides you toward what serves you. This voice sounds more like fear than intuition. True intuition would help you evaluate whether the course is a good investment.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'reflection-1',
    type: 'reflection',
    title: 'Reflection: Your Money Belief',
    content: `
Take a moment to identify a limiting money belief you've held.

**Think of:**
• A pattern in your financial life that keeps repeating
• Something you say about money ("I'm bad with money," "I'll never get ahead")
• An emotion you frequently feel around money (anxiety, guilt, resentment)

**Your belief:**`,
  },
  {
    id: 'rewriting',
    type: 'content',
    title: 'Rewriting Your Story',
    content: `
Once you've identified a limiting belief, you can transform it. This isn't about pretending — it's about choosing a more empowering perspective.

**The transformation process:**
1. **Awareness:** Catch the limiting thought when it appears
2. **Question:** Is this absolutely true? What evidence do I have?
3. **Choose:** What would be more empowering to believe instead?
4. **Practice:** Repeat the new belief until it becomes automatic

**Example transformation:**
• *Old belief:* "I'm just not good with money"
• *Question:* Is this true? Have I learned other skills? Money management is a learnable skill.
• *New belief:* "I can learn to manage money wisely. Every expert was once a beginner."
• *Practice:* Read, take courses, ask questions, take small actions

**Key insight:** You're not lying to yourself. You're choosing a belief that opens possibilities instead of closing them.
    `,
  },
  {
    id: 'wealth-mindset',
    type: 'content',
    title: 'The Wealth Mindset',
    content: `
Financially successful people share certain mindset characteristics. These aren't traits they were born with — they're ways of thinking that anyone can develop.

**Characteristics of a wealth mindset:**
• **Growth orientation:** Believes skills can be learned and wealth can be built
• **Responsibility:** Takes ownership of financial decisions instead of blaming circumstances
• **Long-term thinking:** Makes decisions based on future impact, not just immediate gratification
• **Abundance mentality:** Sees opportunities instead of limitations
• **Value creation:** Focuses on how to create value for others rather than just "getting money"

**The shift:** A wealth mindset isn't about positive thinking. It's about accurate thinking — seeing reality as it is, recognizing your agency, and making choices that serve your long-term goals.
    `,
  },
  {
    id: 'scenario-2',
    type: 'scenario',
    title: 'Scenario: The Spending Choice',
    content: `
You receive a $1,000 bonus at work. You're torn between:
**A)** Spending it on a new gadget you've wanted
**B)** Investing it for your future
**C)** Using it to pay down debt

**How does someone with a wealth mindset approach this decision?*`,
    options: [
      { value: 'a', label: 'Choose B (investing) — wealth mindset always prioritizes future over present', feedback: 'Close, but a wealth mindset isn\'t about deprivation. It considers your whole picture, including your current needs and joy.' },
      { value: 'b', label: 'Evaluate each option based on your goals and values — the answer is personal', feedback: 'Exactly! A wealth mindset considers the full context. Maybe you need the gadget for work (value creation), maybe the debt has high interest (mathematical choice), maybe investing serves your long-term freedom. The key is intentional choice based on your goals, not guilt or impulse.' },
      { value: 'c', label: 'Choose C (debt) — you should always eliminate debt first', feedback: 'This is a rule, not a mindset. Wealth mindset considers the specifics: What interest rate? What are the investment alternatives? What are your goals? Rules replace thinking; mindset empowers better thinking.' },
    ],
    correctAnswer: 'b',
  },
  {
    id: 'reflection-2',
    type: 'reflection',
    title: 'Reflection: Your Wealth Vision',
    content: `
Imagine your financial life 5 years from now if you applied the wealth mindset.

**Consider:**
• What would change about your daily decisions?
• What would you stop doing? What would you start?
• How would you feel about money? (anxiety? confidence? freedom?)
• What's one action you could take today to move toward that vision?

**Write your commitment:**`,
  },
  {
    id: 'emotions',
    type: 'content',
    title: 'Emotions & Money',
    content: `
Money is never just about numbers. Every financial decision has an emotional component. Understanding your emotional patterns is key to better choices.

**Common money emotions:**
• **Fear:** Causes avoidance (not checking accounts), panic selling, or excessive caution
• **Guilt:** Leads to underspending on yourself, over-giving, or self-sabotage when you succeed
• **Shame:** Creates secrecy, hiding problems, and avoiding help
• **Excitement:** Can trigger impulsive spending or overconfidence
• **Resentment:** Leads to comparing yourself to others or making choices out of spite

**The practice:** When you feel a strong emotion around money, pause and name it. "I'm feeling anxious about this purchase." Simple awareness creates space between the emotion and your decision.

**The goal:** Not to eliminate emotions, but to make decisions with emotions considered rather than emotions driving.
    `,
  },
  {
    id: 'summary',
    type: 'summary',
    title: 'Module Complete!',
    content: `
**Congratulations!** You've completed the Mindset & Psychology module.

**Key takeaways:**
• The 80/20 principle: 80% of financial success is psychology
• Your money story was formed unconsciously but can be rewritten consciously
• Limiting beliefs feel like facts but can be transformed
• A wealth mindset can be developed through awareness and practice
• Emotions drive financial decisions — awareness helps you choose wisely

**What's next:**
Now you'll apply what you've learned! The Mindset Assessment will help you identify your current money beliefs and patterns.

*Your reflection responses have been saved. You can review them anytime from your profile.*
    `,
  },
];

export default function MindsetTrainingModule() {
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
      setTrainingProgress('mindsetModule', true);
      navigate('/psychology/mindset-assessment');
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
              className="bg-primary-teal h-2 rounded-full transition-all duration-300"
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
                            : 'bg-primary-teal/20 border-primary-teal'
                          : 'bg-dark-bg border-dark-border hover:border-primary-teal'
                      } ${showFeedback ? 'cursor-default' : 'hover:bg-primary-teal/10'}`}
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
                  className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
                >
                  {isLastScreen ? 'Begin Mindset Assessment →' : 'Continue →'}
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
        className="w-full h-32 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-primary-teal focus:outline-none resize-none"
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
          className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}

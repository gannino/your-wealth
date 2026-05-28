/**
 * Module 1: Foundation
 *
 * Foundation module covering psychology and blueprint fundamentals.
 * Uses contentLoader to fetch from skill chapters and trainingStore for progress.
 */

/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainingStore } from '../../../../stores/trainingStore';
import { createSanitizedMarkup } from '../../../../lib/utils/sanitizeHtml';
import type { ScreenContent, QuizOption } from '../types';

/**
 * Module 1 screen definitions
 *
 * 7 screens total covering foundation topics
 */
const SCREENS: ScreenContent[] = [
  {
    id: 'intro',
    type: 'intro',
    title: 'Welcome to Foundation',
    subtitle: 'Your Money Mindset',
    content: `
      <p class="text-xl mb-6">Welcome to <strong>Module 1: Foundation</strong> — the starting point of your financial mastery journey.</p>

      <p class="mb-4">In this module, you'll discover how your beliefs about money shape every financial decision you make.</p>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-primary-teal text-xl font-bold mb-3">What You'll Learn:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The 80/20 principle and why psychology drives results</li>
          <li>How your money story was formed</li>
          <li>How to identify and transform limiting beliefs</li>
          <li>The mindset shifts that create lasting wealth</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6">
        <h3 class="text-white text-lg font-bold mb-2">⏱️ Time Investment</h3>
        <p class="text-gray-400">Approximately 12-15 minutes to complete this module</p>
      </div>

      <p class="text-gray-400 italic mt-6">Ready to begin building your financial foundation? Let's get started.</p>
    `,
    meta: { duration: '15 minutes' }
  },
  {
    id: '80-20-principle',
    type: 'content',
    title: 'The 80/20 Principle',
    subtitle: 'Why Psychology Matters Most',
    meta: {
      chapterRef: 'ch01-04-money-mastery.md',
      duration: '15 min'
    },
    content: `
      <p class="text-lg mb-4">The book "Money Master the Game" teaches that success in any area follows a simple rule:</p>

      <div class="bg-primary-teal/20 border-l-4 border-primary-teal p-6 my-6 rounded-r-lg">
        <p class="text-2xl font-bold text-white">80% psychology, 20% mechanics</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">What This Means:</h2>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-300">
        <li>Your beliefs, emotions, and decisions drive 80% of your results</li>
        <li>Strategies, tactics, and tools account for only 20%</li>
        <li>You can have the best investment strategy, but if your psychology is wrong, you'll sabotage your results</li>
      </ul>

      <h2 class="text-2xl font-bold text-white mb-4">The Trap:</h2>
      <p class="text-gray-300 mb-4">Most people focus 100% on the mechanics — which stocks to buy, which app to use, which budget template to download. Meanwhile, their unconscious beliefs about money are steering them off course.</p>

      <h2 class="text-2xl font-bold text-white mb-4">The Truth:</h2>
      <p class="text-gray-300">Lasting financial transformation starts from the inside out. Change your psychology, and the right mechanics become obvious and easy to apply.</p>
    `
  },
  {
    id: 'money-story',
    type: 'content',
    title: 'Your Money Story',
    subtitle: 'Understanding Your Financial Past',
    meta: {
      chapterRef: 'ch08-silencing-the-enemy-within.md',
      duration: '20 min'
    },
    content: `
      <p class="text-lg mb-6">Every person has a "money story" — a collection of beliefs, memories, and emotional patterns formed primarily in childhood.</p>

      <h2 class="text-2xl font-bold text-white mb-4">How Your Story Was Written:</h2>
      <ul class="list-disc list-inside space-y-2 mb-6 text-gray-300">
        <li>What your parents said about money ("We can't afford that," "Money is the root of all evil")</li>
        <li>How your family handled financial stress (arguments, silence, avoidance)</li>
        <li>Early experiences with lack or abundance</li>
        <li>Cultural and religious messages about wealth</li>
      </ul>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-primary-teal text-xl font-bold mb-3">The Problem:</h3>
        <p class="text-gray-300 mb-4">Most of this story runs on autopilot in your unconscious mind. You make financial decisions based on beliefs you didn't choose and may not even know you have.</p>

        <h3 class="text-primary-teal text-xl font-bold mb-3">The Opportunity:</h3>
        <p class="text-gray-300">When you become aware of your money story, you can rewrite it. You get to choose which beliefs serve you and which need to be transformed.</p>
      </div>

      <div class="bg-primary-purple/10 border border-primary-purple/30 rounded-lg p-4 my-6">
        <p class="text-gray-200 italic">Reflection: What's one thing your parents said about money that you still hear in your head?</p>
      </div>
    `
  },
  {
    id: 'quiz-80-20',
    type: 'quiz',
    title: 'Knowledge Check',
    subtitle: 'Test Your Understanding',
    meta: { duration: '5 min' },
    content: `
      <p class="text-lg mb-6">Let's check your understanding of the 80/20 principle.</p>

      <h2 class="text-xl font-bold text-white mb-4">Question:</h2>
      <p class="text-xl text-gray-200 mb-8">According to the 80/20 principle in financial success, what accounts for 80% of your results?</p>
    `,
    options: [
      {
        value: 'a',
        label: 'Choosing the right investments and strategies',
        feedback: 'Not quite. Investments and strategies are important, but they\'re part of the 20%. The 80% is something deeper — your psychology, beliefs, and emotional patterns drive most of your financial outcomes.',
        isCorrect: false
      },
      {
        value: 'b',
        label: 'Your psychology, beliefs, and emotions',
        feedback: 'Exactly! Your internal world — beliefs, emotions, decisions — drives 80% of your financial results. This is why two people can use the exact same investment strategy but get completely different outcomes.',
        isCorrect: true
      },
      {
        value: 'c',
        label: 'Market conditions and economic factors',
        feedback: 'While market conditions matter, successful investors navigate all market cycles. The 80/20 principle is about what YOU control — your psychology and decisions — not external factors.',
        isCorrect: false
      },
      {
        value: 'd',
        label: 'Having a detailed budget and tracking expenses',
        feedback: 'Budgets are useful tools (the 20%), but they\'re not the primary driver. Many people budget meticulously yet still struggle because their underlying money beliefs lead to self-sabotage.',
        isCorrect: false
      }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'scenario-money-story',
    type: 'scenario',
    title: 'Identify Your Story',
    subtitle: 'Real-World Application',
    meta: { duration: '10 min' },
    content: `
      <p class="text-lg mb-6">Let's apply what you've learned about money stories to a real scenario.</p>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h2 class="text-xl font-bold text-primary-teal mb-4">📖 The Scenario</h2>
        <p class="text-gray-200 mb-4">You're considering enrolling in a professional certification that could advance your career and increase your earning potential. The cost is $2,000.</p>

        <p class="text-gray-200 mb-4">Immediately, you hear an inner voice say:</p>

        <div class="bg-dark-surface border-l-4 border-primary-purple p-4 my-4 rounded-r-lg">
          <p class="text-lg text-gray-100 italic">"I'll never be wealthy because I'm not smart enough to make good investments anyway. What's the point?"</p>
        </div>

        <p class="text-gray-200">This voice is trying to talk you out of the investment.</p>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">What is this voice telling you about your money story?</h2>
    `,
    options: [
      {
        value: 'a',
        label: 'This is a fact about my abilities',
        feedback: 'This feels like a fact, but it\'s actually a belief. Abilities can be developed. Many successful investors started with zero knowledge. The voice is stating a limitation as if it\'s an unchangeable truth.',
        isCorrect: false
      },
      {
        value: 'b',
        label: 'This is a limiting belief I learned somewhere',
        feedback: 'Exactly! This belief likely came from somewhere — a childhood experience, something someone said, or early failures. It\'s not who you are; it\'s a story you learned. The good news: if you learned it, you can unlearn it and replace it with a more empowering belief.',
        isCorrect: true
      },
      {
        value: 'c',
        label: 'This is my intuition protecting me from risk',
        feedback: 'Intuition guides you toward what serves you and often feels expansive and clear. This voice sounds more like fear than intuition — it\'s shutting down possibility rather than helping you evaluate. True intuition would help you assess whether the certification aligns with your goals.',
        isCorrect: false
      }
    ],
    correctAnswer: 'b'
  },
  {
    id: 'reflection',
    type: 'reflection',
    title: 'Personal Reflection',
    subtitle: 'Your Money Story',
    meta: { duration: '15 min' },
    content: `
      <p class="text-lg mb-6">Now it's time to identify a limiting money belief in your own life.</p>

      <h2 class="text-2xl font-bold text-white mb-4">Reflect on These Questions:</h2>

      <div class="space-y-4 mb-6">
        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">1. Pattern Recognition</h3>
          <p class="text-gray-300">What pattern in your financial life keeps repeating? (e.g., always broke by payday, fear of checking accounts, impulse spending when stressed)</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">2. Self-Talk</h3>
          <p class="text-gray-300">What do you say about yourself and money? (e.g., "I'm bad with money," "I'll never get ahead," "I don't understand investing")</p>
        </div>

        <div class="bg-dark-bg rounded-lg p-4 border border-dark-border">
          <h3 class="text-primary-teal font-bold mb-2">3. Emotional Patterns</h3>
          <p class="text-gray-300">What emotion do you frequently feel around money? (anxiety, guilt, resentment, shame, excitement)</p>
        </div>
      </div>

      <h2 class="text-2xl font-bold text-white mb-4">Your Reflection:</h2>
      <p class="text-gray-300 mb-4">Take a moment to identify one limiting money belief you've held. Write it below.</p>
    `
  },
  {
    id: 'complete',
    type: 'content',
    title: 'Module Complete!',
    subtitle: 'Congratulations!',
    content: `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🎉</div>
        <h2 class="text-3xl font-bold text-primary-teal mb-4">Congratulations!</h2>
        <p class="text-xl text-gray-200">You've completed Module 1: Foundation</p>
      </div>

      <div class="bg-primary-teal/10 border border-primary-teal/30 rounded-lg p-6 my-6">
        <h3 class="text-xl font-bold text-white mb-4">Key Takeaways:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-200">
          <li>The 80/20 principle: 80% of financial success is psychology</li>
          <li>Your money story was formed unconsciously but can be rewritten consciously</li>
          <li>Limiting beliefs feel like facts but can be transformed</li>
          <li>Awareness is the first step to changing your financial trajectory</li>
        </ul>
      </div>

      <div class="bg-dark-bg rounded-lg p-6 my-6 border border-dark-border">
        <h3 class="text-xl font-bold text-white mb-4">What's Next:</h3>
        <p class="text-gray-300 mb-4">You've built a strong foundation. Now it's time to challenge the myths and misconceptions that keep most people trapped financially.</p>

        <p class="text-gray-300 mb-4">In <strong>Module 2: Myth-Busting</strong>, you'll discover:</p>
        <ul class="list-disc list-inside space-y-2 text-gray-400">
          <li>The nine financial myths that destroy wealth</li>
          <li>Hidden fees that are secretly eating your returns</li>
          <li>Conflicts of interest in the financial industry</li>
          <li>How to spot and avoid financial half-truths</li>
        </ul>
      </div>

      <div class="text-center mt-8">
        <p class="text-gray-400 italic">Your progress has been saved. Continue your journey to financial mastery!</p>
      </div>
    `
  }
];

/**
 * Module 1 Foundation Component
 *
 * Main component that manages screen navigation and progress
 */
export default function Module1Foundation() {
  const navigate = useNavigate();
  const {
    startModule,
    recordScreenProgress,
    completeModule,
    getModuleProgress,
    saveReflection,
    reflections
  } = useTrainingStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [reflectionResponse, setReflectionResponse] = useState('');

  const currentScreenData = SCREENS[currentIndex];
  const isLastScreen = currentIndex === SCREENS.length - 1;
  const progress = ((currentIndex + 1) / SCREENS.length) * 100;

  /**
   * Initialize module on mount
   * Resume from saved progress if available
   */
  useEffect(() => {
    startModule('module-1-foundation');

    const savedProgress = getModuleProgress('module-1-foundation');
    if (savedProgress && savedProgress.currentScreen) {
      const savedIndex = SCREENS.findIndex(s => s.id === savedProgress.currentScreen);
      if (savedIndex >= 0) {
        setCurrentIndex(savedIndex);
      }
    }
  }, [getModuleProgress, startModule]);

  /**
   * Load saved reflection when reflection screen is displayed
   */
  useEffect(() => {
    if (currentScreenData.type === 'reflection') {
      const savedReflection = reflections['module-1-reflection']?.response;
      if (savedReflection) {
        setReflectionResponse(savedReflection);
      }
    }
  }, [currentScreenData.type, reflections]);

  /**
   * Record progress when screen changes
   */
  useEffect(() => {
    if (currentScreenData) {
      recordScreenProgress('module-1-foundation', currentScreenData.id, SCREENS.length);
    }
  }, [currentIndex, currentScreenData, recordScreenProgress]);

  /**
   * Handle answer selection for quiz/scenario screens
   */
  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
    setShowFeedback(true);
  };

  /**
   * Handle reflection submission
   */
  const handleReflectionSubmit = () => {
    saveReflection('module-1-reflection', reflectionResponse);
    setTimeout(() => handleNext(), 500);
  };

  /**
   * Navigate to next screen
   */
  const handleNext = () => {
    if (isLastScreen) {
      completeModule('module-1-foundation');
      navigate('/training/hub');
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setReflectionResponse('');
    }
  };

  /**
   * Navigate to previous screen
   */
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      navigate('/training/hub');
    }
  };

  /**
   * Get content for current screen
   */
  const getScreenContent = () => {
    return currentScreenData.content || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg to-dark-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Screen {currentIndex + 1} of {SCREENS.length}</span>
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
          {currentScreenData.title && (
            <h1 className="text-4xl font-bold text-white mb-2">
              {currentScreenData.title}
            </h1>
          )}
          {currentScreenData.subtitle && (
            <p className="text-xl text-primary-teal mb-6">
              {currentScreenData.subtitle}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            {currentScreenData.type === 'reflection' ? (
              <ReflectionScreen
                screen={currentScreenData}
                response={reflectionResponse}
                onResponseChange={setReflectionResponse}
                onSubmit={handleReflectionSubmit}
                onBack={handleBack}
              />
            ) : (
              <>
                <div
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={createSanitizedMarkup(getScreenContent())}
                />

                {/* Quiz/Scenario Options */}
                {(currentScreenData.type === 'quiz' || currentScreenData.type === 'scenario') &&
                  currentScreenData.options && (
                  <div className="mt-8 space-y-3">
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
                        <span className="text-gray-200 font-semibold">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Feedback */}
                {showFeedback && selectedAnswer && currentScreenData.options && (
                  <div
                    className={`mt-6 p-4 rounded-lg border ${
                      selectedAnswer === currentScreenData.correctAnswer
                        ? 'bg-green-400/10 border-green-400/30'
                        : 'bg-red-400/10 border-red-400/30'
                    }`}
                  >
                    <p className="text-gray-300">
                      {currentScreenData.options.find((o: QuizOption) => o.value === selectedAnswer)
                        ?.feedback || ''}
                    </p>
                  </div>
                )}

                {/* Navigation (not for reflection screens) */}
                {(currentScreenData.type === 'intro' ||
                  currentScreenData.type === 'content' ||
                  currentScreenData.type === 'quiz' ||
                  currentScreenData.type === 'scenario') && (
                  <div className="flex justify-between items-center mt-8">
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={
                        (currentScreenData.type === 'quiz' ||
                          currentScreenData.type === 'scenario') &&
                        !showFeedback
                      }
                      className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLastScreen ? 'Complete Module →' : 'Continue →'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reflection Screen Component
 *
 * Handles reflection input with textarea
 */
function ReflectionScreen({
  screen,
  response,
  onResponseChange,
  onSubmit,
  onBack
}: {
  screen: ScreenContent;
  response: string;
  onResponseChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  return (
    <div>
      <div
        className="text-gray-300 leading-relaxed mb-6"
        dangerouslySetInnerHTML={createSanitizedMarkup(screen.content || '')}
      />

      <textarea
        value={response}
        onChange={(e) => onResponseChange(e.target.value)}
        placeholder="Type your reflection here..."
        className="w-full h-40 bg-dark-bg border border-dark-border rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:border-primary-teal focus:outline-none resize-none"
      />

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg border border-dark-border text-gray-300 hover:border-gray-500 hover:text-white transition-colors font-semibold"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!response.trim()}
          className="px-6 py-3 rounded-lg bg-primary-teal hover:bg-teal-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
}

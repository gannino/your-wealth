/**
 * Module Content Map
 *
 * Single source of truth mapping training modules to skill chapters.
 * Links the 5 training modules to specific chapters from the unshakable
 * and money-master-the-game skills.
 */

/**
 * Reference to a specific chapter in a skill
 */
export interface ChapterReference {
  skill: 'unshakable' | 'money-master-the-game';
  chapter: string;  // filename like 'ch01-unshakeable.md'
  title: string;
}

/**
 * Complete content mapping for a training module
 */
export interface ModuleContentMapping {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  learningObjective: string;
  chapters: ChapterReference[];
  knowledgeChecks: string[];
  assessmentLink: string;
  estimatedDuration: string;
}

/**
 * Complete mapping of all 5 training modules to their respective chapters
 */
const MODULE_MAPPINGS: ModuleContentMapping[] = [
  {
    id: 'module-1-foundation',
    title: 'Foundation',
    subtitle: 'Your Money Mindset',
    description: 'Establish the fundamental mindset and understanding required for financial mastery. Learn why money is important and how to take control of your financial life.',
    learningObjective: 'Develop a clear understanding of your relationship with money and establish the foundation for financial freedom.',
    chapters: [
      {
        skill: 'money-master-the-game',
        chapter: 'ch01-04-money-mastery.md',
        title: 'Money Mastery'
      },
      {
        skill: 'unshakable',
        chapter: 'ch01-unshakeable.md',
        title: 'Unshakeable: Your Financial Freedom'
      },
      {
        skill: 'unshakable',
        chapter: 'ch08-silencing-the-enemy-within.md',
        title: 'Silencing the Enemy Within'
      },
      {
        skill: 'unshakable',
        chapter: 'ch09-real-wealth.md',
        title: 'Real Wealth'
      }
    ],
    knowledgeChecks: [
      'What is your primary motivation for financial freedom?',
      'How would you rate your current money mindset on a scale of 1-10?',
      'What are the top 3 money beliefs that have shaped your financial decisions?'
    ],
    assessmentLink: '/assessment/module-1-foundation',
    estimatedDuration: '2 hours'
  },
  {
    id: 'module-2-myth-busting',
    title: 'Myth-Busting',
    subtitle: 'The Financial Truth',
    description: 'Expose the nine financial myths that keep people trapped. Learn the truth about hidden fees, broker conflicts, and the retirement planning industry.',
    learningObjective: 'Identify and overcome the financial myths that have been costing you money and limiting your returns.',
    chapters: [
      {
        skill: 'money-master-the-game',
        chapter: 'ch02-00-nine-financial-myths.md',
        title: 'Nine Financial Myths'
      },
      {
        skill: 'money-master-the-game',
        chapter: 'ch02-02-myth2-hidden-fees.md',
        title: 'Myth #2: Hidden Fees'
      },
      {
        skill: 'money-master-the-game',
        chapter: 'ch02-04-myth4-broker-conflicts.md',
        title: 'Myth #4: Broker Conflicts'
      },
      {
        skill: 'unshakable',
        chapter: 'ch03-hidden-fees-half-truths.md',
        title: 'Hidden Fees and Half Truths'
      },
      {
        skill: 'unshakable',
        chapter: 'ch04-rescuing-retirement-plans.md',
        title: 'Rescuing Your Retirement Plans'
      }
    ],
    knowledgeChecks: [
      'What is the total fee percentage you\'re currently paying on your investments?',
      'Name 3 financial myths you previously believed',
      'How do conflicts of interest in the financial industry affect your returns?'
    ],
    assessmentLink: '/assessment/module-2-myth-busting',
    estimatedDuration: '2 hours'
  },
  {
    id: 'module-3-strategy',
    title: 'Strategy',
    subtitle: 'Your Game Plan',
    description: 'Create your personalized investment strategy. Learn the core four asset allocation, understand market cycles, and build a portfolio that can weather any season.',
    learningObjective: 'Design a comprehensive investment strategy based on your goals, timeline, and risk tolerance.',
    chapters: [
      {
        skill: 'money-master-the-game',
        chapter: 'ch03-01-price-of-dreams.md',
        title: 'The Price of Your Dreams'
      },
      {
        skill: 'money-master-the-game',
        chapter: 'ch01-04-money-mastery.md',
        title: 'Money Mastery: The 3 Buckets'
      },
      {
        skill: 'money-master-the-game',
        chapter: 'ch05-01-all-seasons.md',
        title: 'All Seasons Strategy'
      },
      {
        skill: 'unshakable',
        chapter: 'ch02-winter-is-coming.md',
        title: 'Winter Is Coming: Market Cycles'
      },
      {
        skill: 'unshakable',
        chapter: 'ch06-the-core-four.md',
        title: 'The Core Four Asset Classes'
      }
    ],
    knowledgeChecks: [
      'What are the 3 buckets in your money mastery strategy?',
      'How would you allocate your portfolio across the Core Four asset classes?',
      'What is your target financial freedom number?'
    ],
    assessmentLink: '/assessment/module-3-strategy',
    estimatedDuration: '3 hours'
  },
  {
    id: 'module-4-execution',
    title: 'Execution',
    subtitle: 'Taking Action',
    description: 'Put your strategy into action. Learn how to select the right investments, minimize fees and taxes, and build a diversified portfolio using index funds.',
    learningObjective: 'Execute your investment strategy with confidence, selecting the right vehicles and optimizing for returns.',
    chapters: [
      {
        skill: 'money-master-the-game',
        chapter: 'ch06-00-defense-first.md',
        title: 'Defense First: Protection Strategy'
      },
      {
        skill: 'money-master-the-game',
        chapter: 'ch06-02-index-funds.md',
        title: 'Index Funds: The Smart Money Choice'
      },
      {
        skill: 'unshakable',
        chapter: 'ch05-who-can-you-really-trust.md',
        title: 'Who Can You Really Trust?'
      }
    ],
    knowledgeChecks: [
      'What criteria will you use to select index funds?',
      'How will you minimize fees and taxes in your portfolio?',
      'What is your rebalancing strategy?'
    ],
    assessmentLink: '/assessment/module-4-execution',
    estimatedDuration: '2 hours'
  },
  {
    id: 'module-5-mastery',
    title: 'Mastery',
    subtitle: 'Living Wealthy',
    description: 'Achieve true wealth and live your purpose. Learn the Freedom Facts, master your psychology, and discover the joy of giving back.',
    learningObjective: 'Achieve financial mastery and live a life of abundance, purpose, and contribution.',
    chapters: [
      {
        skill: 'unshakable',
        chapter: 'ch02-winter-is-coming.md',
        title: 'Freedom Facts: The Truth About Markets'
      },
      {
        skill: 'unshakable',
        chapter: 'ch07-slay-the-bear.md',
        title: 'Slay the Bear: Overcoming Fear'
      },
      {
        skill: 'unshakable',
        chapter: 'ch09-real-wealth.md',
        title: 'Real Wealth: Living Your Purpose'
      },
      {
        skill: 'money-master-the-game',
        chapter: 'ch07-00-enjoy-share.md',
        title: 'Enjoy and Share: The True Meaning of Wealth'
      }
    ],
    knowledgeChecks: [
      'What does real wealth mean to you beyond money?',
      'How will you use your wealth to make a difference?',
      'What is your legacy plan?'
    ],
    assessmentLink: '/assessment/module-5-mastery',
    estimatedDuration: '1 hour'
  }
];

/**
 * Get all module mappings
 * @returns Array of all 5 module content mappings
 */
export function getAllModules(): ModuleContentMapping[] {
  return MODULE_MAPPINGS;
}

/**
 * Get all module IDs
 * @returns Array of module IDs in order
 */
export function getModuleIds(): string[] {
  return MODULE_MAPPINGS.map(module => module.id);
}

/**
 * Get a specific module mapping by ID
 * @param moduleId - The ID of the module to retrieve
 * @returns The module mapping or undefined if not found
 */
export function getModuleMapping(moduleId: string): ModuleContentMapping | undefined {
  return MODULE_MAPPINGS.find(module => module.id === moduleId);
}

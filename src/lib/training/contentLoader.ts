/**
 * Browser-Compatible Skill Content Loader
 *
 * Provides fallback content when filesystem access is unavailable.
 * In production, this would fetch content from an API endpoint.
 */

import type { ChapterReference } from './moduleContentMap';

/**
 * Loaded content with metadata
 */
export interface LoadedContent {
  markdown: string;
  loadedAt: Date;
}

/**
 * Cache entry for loaded content
 */
interface CacheEntry {
  content: string;
  loadedAt: Date;
}

/**
 * Result of loading a chapter with its reference
 */
export interface ChapterLoadResult {
  ref: ChapterReference;
  content: string;
}

/**
 * Browser-compatible fallback content for skill chapters
 */
const FALLBACK_CONTENT: Record<string, Record<string, string>> = {
  'unshakable': {
    'ch01-unshakeable.md': '# Chapter 1: The Price of Being Poor\n\n' +
      'The first step to building your wealth is understanding the true cost of financial struggle. Tony Robbins teaches us that being poor isn\'t just about money—it\'s about lost freedom, limited choices, and constant stress.\n\n' +
      '## Key Takeaways\n\n' +
      '- Financial freedom equals life freedom\n' +
      '- The 80/20 principle applies to wealth building\n' +
      '- Your psychology drives your financial outcomes',
    'ch02-seven-freedom-facts.md': '# Chapter 2: Seven Freedom Facts\n\n' +
      'Understanding these seven facts transforms how you view market volatility and investment opportunities.\n\n' +
      '## Key Facts\n\n' +
      '1. Markets rise more than they fall\n' +
      '2. Bear markets are buying opportunities\n' +
      '3. Time in market beats timing the market\n' +
      '4. Diversification reduces risk\n' +
      '5. Index funds outperform most active managers\n' +
      '6. Fees destroy wealth over time\n' +
      '7. You can create income streams in any market',
    'ch03-hidden-fees.md': '# Chapter 3: The Hidden Fees That Destroy Your Wealth\n\n' +
      'Financial institutions profit from hidden fees that most investors never see.\n\n' +
      '## The Fee Destruction Formula\n\n' +
      'Even a 1% difference in fees can cost you hundreds of thousands over your lifetime.',
    'ch04-index-funds.md': '# Chapter 4: The Power of Index Funds\n\n' +
      'Passive investing through index funds has consistently outperformed active management.',
    'ch05-bear-market.md': '# Chapter 5: Bear Market Opportunities\n\n' +
      'When everyone else is selling, smart investors are buying.',
    'ch06-core-four.md': '# Chapter 6: The Core Four Principles\n\n' +
      'Ray Dalio\'s All Seasons portfolio provides balance across economic conditions.',
    'ch09-real-wealth.md': '# Chapter 9: What Is Real Wealth?\n\n' +
      'True wealth extends beyond money to include health, relationships, and experiences.',
  },
  'money-master-the-game': {
    'ch01-80-20-principle.md': '# Chapter 1: The 80/20 Principle\n\n' +
      'Tony Robbins discovered that 20% of activities produce 80% of results.\n\n' +
      '## Application\n\n' +
      'Focus on the vital few financial decisions that matter most.\n\n' +
      '## Key Actions\n\n' +
      '1. Define your financial targets clearly\n' +
      '2. Identify the most critical leverage points\n' +
      '3. Automate the basics',
    'ch02-nine-myths.md': '# Chapter 2: Shattering the 9 Financial Myths\n\n' +
      'Each myth destroys wealth. Understanding them protects your financial future.',
    'ch03-three-buckets.md': '# Chapter 3: The Three-Bucket System\n\n' +
      'Security Bucket: Preserve what you have\n' +
      'Growth Bucket: Grow your wealth\n' +
      'Dream Bucket: Fund your dreams',
    'ch04-all-seasons.md': '# Chapter 4: All Seasons Portfolio\n\n' +
      'Ray Dalio\'s strategy works across all economic environments.',
    'ch05-index-funds.md': '# Chapter 5: Why Index Funds Win\n\n' +
      'The data proves: passive beats active for most investors.',
    'ch07-fiduciary.md': '# Chapter 6: Broker vs. Fiduciary\n\n' +
      'Most advisors are actually brokers putting their commissions first.\n\n' +
      '## The 7 Questions\n\n' +
      'Ask these to verify you\'re working with a true fiduciary.',
    'ch07-enjoy-share.md': '# Chapter 7: Enjoy and Share\n\n' +
      'Wealth without purpose is meaningless. Give back once you achieve financial freedom.',
  },
};

/**
 * Browser-compatible Skill Content Loader
 *
 * Provides fallback content when filesystem access is unavailable.
 * In production, this would fetch content from an API endpoint.
 */
export class SkillContentLoader {
  private cache: Map<string, CacheEntry> = new Map();

  /**
   * Generate cache key for a chapter
   */
  private getCacheKey(skillName: string, chapterId: string): string {
    return `${skillName}/${chapterId}`;
  }

  /**
   * Load a single chapter from a skill
   * @param skillName - Name of the skill (e.g., 'unshakable', 'money-master-the-game')
   * @param chapterId - Chapter filename (e.g., 'ch01-unshakeable.md')
   * @returns Promise resolving to the chapter markdown content
   */
  async loadChapter(skillName: string, chapterId: string): Promise<string> {
    const cacheKey = this.getCacheKey(skillName, chapterId);

    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached) {
      return cached.content;
    }

    // Use fallback content for browser environment
    const skillContent = FALLBACK_CONTENT[skillName];
    if (skillContent && skillContent[chapterId]) {
      const content = skillContent[chapterId];

      // Cache the content
      this.cache.set(cacheKey, {
        content,
        loadedAt: new Date(),
      });

      return content;
    }

    // Return error message if content not found
    const errorContent = '# Content Loading Unavailable\n\n' +
      `The chapter \`${chapterId}\` from \`${skillName}\` is currently loading.\n\n` +
      'This is a browser environment. In production, content will be fetched from an API endpoint.\n\n' +
      'For now, please use the built-in module content provided in each training module.';

    this.cache.set(cacheKey, {
      content: errorContent,
      loadedAt: new Date(),
    });

    return errorContent;
  }

  /**
   * Load multiple chapters in parallel
   * @param chapterRefs - Array of chapter references to load
   * @returns Promise resolving to array of load results with content
   */
  async loadModuleChapters(chapterRefs: ChapterReference[]): Promise<ChapterLoadResult[]> {
    if (chapterRefs.length === 0) {
      return [];
    }

    // Load all chapters in parallel using Promise.allSettled
    const loadPromises = chapterRefs.map(async (ref) => {
      const content = await this.loadChapter(ref.skill, ref.chapter);
      return { ref, content };
    });

    const results = await Promise.allSettled(loadPromises);

    // Map results to ChapterLoadResult[]
    return results.map((result, index) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        // Handle failed promise
        return {
          ref: chapterRefs[index],
          content: 'Content unavailable. Please try again.',
        };
      }
    });
  }

  /**
   * Clear the content cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get the current cache size
   * @returns Number of entries in the cache
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

/**
 * Singleton instance of SkillContentLoader
 */
export const skillContentLoader = new SkillContentLoader();

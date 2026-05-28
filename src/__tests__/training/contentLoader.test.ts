/**
 * Tests for SkillContentLoader
 *
 * Tests the dynamic content loader that loads skill chapters from the filesystem.
 * Uses TDD approach: tests written first, then implementation.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SkillContentLoader } from '../../lib/training/contentLoader';
import type { ChapterReference } from '../../lib/training/moduleContentMap';

describe('SkillContentLoader', () => {
  let loader: SkillContentLoader;

  beforeEach(() => {
    // Create a fresh instance for each test
    loader = new SkillContentLoader();
  });

  describe('loadChapter', () => {
    it('should load a chapter from a skill', async () => {
      const content = await loader.loadChapter('unshakable', 'ch01-unshakeable.md');

      expect(content).toBeDefined();
      expect(content.length).toBeGreaterThan(0);
      expect(content).toContain('#');
    });

    it('should return fallback content for non-existent chapters', async () => {
      const content = await loader.loadChapter('unshakable', 'non-existent.md');

      expect(content).toBe('Content unavailable. Please try again.');
    });

    it('should return fallback content for non-existent skills', async () => {
      const content = await loader.loadChapter('non-existent', 'ch01.md');

      expect(content).toBe('Content unavailable. Please try again.');
    });

    it('should cache loaded content', async () => {
      // First load
      const content1 = await loader.loadChapter('unshakable', 'ch01-unshakeable.md');
      const cacheSize1 = loader.getCacheSize();

      // Second load should use cache
      const content2 = await loader.loadChapter('unshakable', 'ch01-unshakeable.md');
      const cacheSize2 = loader.getCacheSize();

      expect(content1).toBe(content2);
      expect(cacheSize1).toBe(cacheSize2);
      expect(cacheSize1).toBeGreaterThan(0);
    });
  });

  describe('clearCache', () => {
    it('should clear the cache', async () => {
      // Load something to populate cache
      await loader.loadChapter('unshakable', 'ch01-unshakeable.md');
      expect(loader.getCacheSize()).toBeGreaterThan(0);

      // Clear cache
      loader.clearCache();
      expect(loader.getCacheSize()).toBe(0);
    });
  });

  describe('loadModuleChapters', () => {
    it('should load multiple chapters in parallel', async () => {
      const chapterRefs: ChapterReference[] = [
        {
          skill: 'unshakable',
          chapter: 'ch01-unshakeable.md',
          title: 'Unshakeable'
        },
        {
          skill: 'unshakable',
          chapter: 'ch02-winter-is-coming.md',
          title: 'Winter Is Coming'
        }
      ];

      const results = await loader.loadModuleChapters(chapterRefs);

      expect(results).toHaveLength(2);
      expect(results[0]).toHaveProperty('ref');
      expect(results[0]).toHaveProperty('content');
      expect(results[1]).toHaveProperty('ref');
      expect(results[1]).toHaveProperty('content');
    });

    it('should handle failed chapter loads gracefully', async () => {
      const chapterRefs: ChapterReference[] = [
        {
          skill: 'unshakable',
          chapter: 'ch01-unshakeable.md',
          title: 'Valid Chapter'
        },
        {
          skill: 'unshakable',
          chapter: 'non-existent.md',
          title: 'Invalid Chapter'
        }
      ];

      const results = await loader.loadModuleChapters(chapterRefs);

      expect(results).toHaveLength(2);
      // First should have content
      expect(results[0].content.length).toBeGreaterThan(0);
      // Second should have fallback
      expect(results[1].content).toBe('Content unavailable. Please try again.');
    });

    it('should handle empty chapter list', async () => {
      const results = await loader.loadModuleChapters([]);

      expect(results).toHaveLength(0);
    });

    it('should cache all loaded chapters', async () => {
      const chapterRefs: ChapterReference[] = [
        {
          skill: 'unshakable',
          chapter: 'ch01-unshakeable.md',
          title: 'Unshakeable'
        },
        {
          skill: 'money-master-the-game',
          chapter: 'ch01-04-money-mastery.md',
          title: 'Money Mastery'
        }
      ];

      await loader.loadModuleChapters(chapterRefs);
      const cacheSize = loader.getCacheSize();

      expect(cacheSize).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getCacheSize', () => {
    it('should return 0 for empty cache', () => {
      expect(loader.getCacheSize()).toBe(0);
    });

    it('should return correct cache size after loads', async () => {
      await loader.loadChapter('unshakable', 'ch01-unshakeable.md');
      expect(loader.getCacheSize()).toBe(1);

      await loader.loadChapter('unshakable', 'ch02-winter-is-coming.md');
      expect(loader.getCacheSize()).toBe(2);
    });

    it('should not increment cache size for repeated loads', async () => {
      await loader.loadChapter('unshakable', 'ch01-unshakeable.md');
      expect(loader.getCacheSize()).toBe(1);

      await loader.loadChapter('unshakable', 'ch01-unshakeable.md');
      expect(loader.getCacheSize()).toBe(1);
    });
  });
});

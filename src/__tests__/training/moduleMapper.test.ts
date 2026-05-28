/**
 * Test suite for moduleContentMap.ts
 *
 * Tests the mapping between training modules and skill chapters
 */

import {
  getAllModules,
  getModuleIds,
  getModuleMapping,
  ModuleContentMapping,
  ChapterReference
} from '../../lib/training/moduleContentMap';

describe('moduleContentMap', () => {
  describe('getAllModules', () => {
    it('should return exactly 5 modules', () => {
      const modules = getAllModules();
      expect(modules).toHaveLength(5);
    });

    it('should return modules with all required fields', () => {
      const modules = getAllModules();

      modules.forEach((module: ModuleContentMapping) => {
        expect(module).toHaveProperty('id');
        expect(module).toHaveProperty('title');
        expect(module).toHaveProperty('description');
        expect(module).toHaveProperty('learningObjective');
        expect(module).toHaveProperty('chapters');
        expect(module).toHaveProperty('knowledgeChecks');
        expect(module).toHaveProperty('assessmentLink');
        expect(module).toHaveProperty('estimatedDuration');

        expect(typeof module.id).toBe('string');
        expect(typeof module.title).toBe('string');
        expect(typeof module.description).toBe('string');
        expect(typeof module.learningObjective).toBe('string');
        expect(Array.isArray(module.chapters)).toBe(true);
        expect(Array.isArray(module.knowledgeChecks)).toBe(true);
        expect(typeof module.assessmentLink).toBe('string');
        expect(typeof module.estimatedDuration).toBe('string');
      });
    });

    it('should return modules with correct IDs in order', () => {
      const modules = getAllModules();
      const ids = modules.map(m => m.id);

      expect(ids).toEqual([
        'module-1-foundation',
        'module-2-myth-busting',
        'module-3-strategy',
        'module-4-execution',
        'module-5-mastery'
      ]);
    });
  });

  describe('getModuleIds', () => {
    it('should return array of 5 module IDs', () => {
      const ids = getModuleIds();
      expect(ids).toHaveLength(5);
    });

    it('should return correct module IDs', () => {
      const ids = getModuleIds();
      expect(ids).toEqual([
        'module-1-foundation',
        'module-2-myth-busting',
        'module-3-strategy',
        'module-4-execution',
        'module-5-mastery'
      ]);
    });
  });

  describe('getModuleMapping', () => {
    it('should return correct module for valid ID', () => {
      const module = getModuleMapping('module-1-foundation');

      expect(module).toBeDefined();
      expect(module?.id).toBe('module-1-foundation');
      expect(module?.title).toBe('Foundation');
    });

    it('should return undefined for invalid module ID', () => {
      const module = getModuleMapping('invalid-module-id');
      expect(module).toBeUndefined();
    });

    it('should return correct chapters for Module 1: Foundation', () => {
      const module = getModuleMapping('module-1-foundation');

      expect(module?.chapters).toHaveLength(4);

      const chapterFiles = module?.chapters.map((c: ChapterReference) => c.chapter) || [];

      // Should contain money-master-the-game chapters
      expect(chapterFiles).toContain('ch01-04-money-mastery.md');

      // Should contain unshakable chapters
      expect(chapterFiles).toContain('ch01-unshakeable.md');
      expect(chapterFiles).toContain('ch08-silencing-the-enemy-within.md');
      expect(chapterFiles).toContain('ch09-real-wealth.md');
    });

    it('should return correct chapters for Module 2: Myth-Busting', () => {
      const module = getModuleMapping('module-2-myth-busting');

      expect(module?.chapters).toHaveLength(5);

      const chapterFiles = module?.chapters.map((c: ChapterReference) => c.chapter) || [];

      // Money-master-the-game chapters
      expect(chapterFiles).toContain('ch02-00-nine-financial-myths.md');
      expect(chapterFiles).toContain('ch02-02-myth2-hidden-fees.md');
      expect(chapterFiles).toContain('ch02-04-myth4-broker-conflicts.md');

      // Unshakable chapters
      expect(chapterFiles).toContain('ch03-hidden-fees-half-truths.md');
      expect(chapterFiles).toContain('ch04-rescuing-retirement-plans.md');
    });

    it('should return correct chapters for Module 3: Strategy', () => {
      const module = getModuleMapping('module-3-strategy');

      expect(module?.chapters).toHaveLength(5);

      const chapterFiles = module?.chapters.map((c: ChapterReference) => c.chapter) || [];

      // Money-master-the-game chapters
      expect(chapterFiles).toContain('ch03-01-price-of-dreams.md');
      expect(chapterFiles).toContain('ch01-04-money-mastery.md'); // 3 buckets reference
      expect(chapterFiles).toContain('ch05-01-all-seasons.md');

      // Unshakable chapters
      expect(chapterFiles).toContain('ch02-winter-is-coming.md');
      expect(chapterFiles).toContain('ch06-the-core-four.md');
    });

    it('should return correct chapters for Module 4: Execution', () => {
      const module = getModuleMapping('module-4-execution');

      expect(module?.chapters).toHaveLength(3);

      const chapterFiles = module?.chapters.map((c: ChapterReference) => c.chapter) || [];

      // Money-master-the-game chapters
      expect(chapterFiles).toContain('ch06-00-defense-first.md');
      expect(chapterFiles).toContain('ch06-02-index-funds.md');

      // Unshakable chapters
      expect(chapterFiles).toContain('ch05-who-can-you-really-trust.md');
    });

    it('should return correct chapters for Module 5: Mastery', () => {
      const module = getModuleMapping('module-5-mastery');

      expect(module?.chapters).toHaveLength(4);

      const chapterFiles = module?.chapters.map((c: ChapterReference) => c.chapter) || [];

      // Unshakable chapters
      expect(chapterFiles).toContain('ch02-winter-is-coming.md'); // Freedom Facts
      expect(chapterFiles).toContain('ch07-slay-the-bear.md');
      expect(chapterFiles).toContain('ch09-real-wealth.md');

      // Money-master-the-game chapters
      expect(chapterFiles).toContain('ch07-00-enjoy-share.md');
    });

    it('should have correct skill references in all chapters', () => {
      const modules = getAllModules();

      modules.forEach((module: ModuleContentMapping) => {
        module.chapters.forEach((chapter: ChapterReference) => {
          expect(chapter.skill).toMatch(/^(unshakable|money-master-the-game)$/);
          expect(typeof chapter.chapter).toBe('string');
          expect(chapter.chapter).toMatch(/\.md$/);
          expect(typeof chapter.title).toBe('string');
        });
      });
    });

    it('should have non-empty knowledge checks for all modules', () => {
      const modules = getAllModules();

      modules.forEach((module: ModuleContentMapping) => {
        expect(module.knowledgeChecks.length).toBeGreaterThan(0);
        module.knowledgeChecks.forEach((check: string) => {
          expect(typeof check).toBe('string');
          expect(check.length).toBeGreaterThan(0);
        });
      });
    });

    it('should have valid assessment links for all modules', () => {
      const modules = getAllModules();

      modules.forEach((module: ModuleContentMapping) => {
        expect(module.assessmentLink).toMatch(/^\/assessment\//);
      });
    });

    it('should have valid estimated duration for all modules', () => {
      const modules = getAllModules();

      modules.forEach((module: ModuleContentMapping) => {
        expect(module.estimatedDuration).toMatch(/^\d+ (minute|hour|minutes|hours)$/);
      });
    });
  });
});

/**
 * Training Flow Integration Tests
 *
 * Tests complete user journey:
 * 1. Start module → Complete screens → Knowledge checks → Module complete
 * 2. Progress tracking across multiple modules
 * 3. Achievement unlocking
 * 4. Assessment score integration
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrainingStore } from '../../stores/trainingStore';
import {
  getOverallTrainingProgress,
  calculateTrainingScore,
  getModuleRecommendations,
} from '../../lib/assessments/enhancedScoring';

describe('Training Flow Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useTrainingStore.getState().resetProgress();
  });

  describe('Complete Module Journey', () => {
    it('should track progress through module 1 from start to complete', () => {
      const { result } = renderHook(() => useTrainingStore());
      const moduleId = 'module-1-foundation';

      // Initial state: module not started
      expect(result.current.isModuleComplete(moduleId)).toBe(false);
      expect(result.current.moduleProgress[moduleId]).toBeUndefined();

      // Start the module
      act(() => {
        result.current.startModule(moduleId);
      });

      // Module should be in progress
      expect(result.current.moduleProgress[moduleId]).toBeDefined();
      expect(result.current.moduleProgress[moduleId].startedAt).toBeInstanceOf(Date);

      // Complete some screens
      act(() => {
        result.current.recordScreenProgress(moduleId, 'intro', 7);
        result.current.recordScreenProgress(moduleId, 'content-1', 7);
      });

      // Progress should increase
      expect(result.current.moduleProgress[moduleId].percentComplete).toBeGreaterThan(0);

      // Complete remaining screens
      act(() => {
        result.current.recordScreenProgress(moduleId, 'content-2', 7);
        result.current.recordScreenProgress(moduleId, 'quiz-1', 7);
        result.current.recordScreenProgress(moduleId, 'scenario-1', 7);
        result.current.recordScreenProgress(moduleId, 'reflection-1', 7);
        result.current.recordScreenProgress(moduleId, 'complete', 7);
      });

      // Module should be complete
      expect(result.current.isModuleComplete(moduleId)).toBe(true);
      expect(result.current.moduleProgress[moduleId].percentComplete).toBe(100);
      expect(result.current.moduleProgress[moduleId].completedAt).toBeInstanceOf(Date);
    });

    it('should record knowledge check results during module', () => {
      const { result } = renderHook(() => useTrainingStore());
      const moduleId = 'module-2-mythbusting';

      act(() => {
        result.current.startModule(moduleId);
      });

      // Complete knowledge check with passing score
      act(() => {
        result.current.recordKnowledgeCheckResult('module-2-quiz-1', {
          score: 100,
          passed: true,
          answers: { q1: 'b', q2: 'a' },
          completedAt: new Date(),
        });
      });

      // Knowledge check should be saved
      const checkResult = result.current.knowledgeCheckResults['module-2-quiz-1'];
      expect(checkResult).toBeDefined();
      expect(checkResult?.passed).toBe(true);
      expect(checkResult?.score).toBe(100);
    });
  });

  describe('Multi-Module Progress Tracking', () => {
    it('should track progress across multiple modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Start and complete module 1
      act(() => {
        result.current.startModule('module-1-foundation');
        result.current.completeModule('module-1-foundation');
      });

      // Start and complete module 2
      act(() => {
        result.current.startModule('module-2-mythbusting');
        result.current.completeModule('module-2-mythbusting');
      });

      // Both modules should be complete
      expect(result.current.isModuleComplete('module-1-foundation')).toBe(true);
      expect(result.current.isModuleComplete('module-2-mythbusting')).toBe(true);

      // Overall progress should be 40% (2 out of 5 modules)
      const overallProgress = getOverallTrainingProgress();
      expect(overallProgress).toBe(40);
    });

    it('should calculate training score correctly', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Complete modules with different weights
      act(() => {
        result.current.completeModule('module-1-foundation'); // 25% weight
        result.current.completeModule('module-2-mythbusting'); // 20% weight
        result.current.completeModule('module-3-strategy'); // 25% weight
      });

      const score = calculateTrainingScore();
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);

      // With 3/5 modules complete (70% of total weight), score should be substantial
      expect(score).toBeGreaterThan(50);
    });
  });

  describe('Achievement System', () => {
    it('should unlock Quick Learner achievement on first module complete', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
      });

      const achievements = result.current.achievements;
      const firstModuleBadge = achievements.find(a => a.badge === 'first-module');
      expect(firstModuleBadge).toBeDefined();
    });

    it('should unlock Halfway There achievement at 3 modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
        result.current.completeModule('module-3-strategy');
      });

      const achievements = result.current.achievements;
      const halfCompleteBadge = achievements.find(a => a.badge === 'half-complete');
      expect(halfCompleteBadge).toBeDefined();
    });

    it('should unlock Your Wealth Graduate at 5 modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
        result.current.completeModule('module-3-strategy');
        result.current.completeModule('module-4-execution');
        result.current.completeModule('module-5-mastery');
      });

      const achievements = result.current.achievements;
      const graduateBadge = achievements.find(a => a.badge === 'all-complete');
      expect(graduateBadge).toBeDefined();
    });
  });

  describe('Reflection Storage', () => {
    it('should save and retrieve reflection responses', () => {
      const { result } = renderHook(() => useTrainingStore());
      const reflectionId = 'module-1-reflection-money-story';

      act(() => {
        result.current.saveReflection(reflectionId, 'My money story is...');
      });

      const saved = result.current.reflections[reflectionId];
      expect(saved?.response).toBe('My money story is...');
      expect(saved?.updatedAt).toBeInstanceOf(Date);
    });

    it('should update existing reflection', () => {
      const { result } = renderHook(() => useTrainingStore());
      const reflectionId = 'module-2-reflection-fees';

      act(() => {
        result.current.saveReflection(reflectionId, 'Initial thought');
        result.current.saveReflection(reflectionId, 'Updated thought');
      });

      const saved = result.current.reflections[reflectionId];
      expect(saved?.response).toBe('Updated thought');
    });
  });

  describe('Assessment Integration', () => {
    it('should recommend modules based on blueprint scores', () => {
      renderHook(() => useTrainingStore());

      // Low psychology score → recommend Module 1
      const recommendations = getModuleRecommendations({
        psychology: 50,
        economics: 80,
        planning: 75,
        execution: 70,
      });

      expect(recommendations).toContain('module-1-foundation');
    });

    it('should recommend strategy module for low planning scores', () => {
      renderHook(() => useTrainingStore());

      const recommendations = getModuleRecommendations({
        psychology: 80,
        economics: 75,
        planning: 50,
        execution: 70,
      });

      expect(recommendations).toContain('module-3-strategy');
    });

    it('should not recommend already completed modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
      });

      const recommendations = getModuleRecommendations({
        psychology: 50,
        economics: 80,
        planning: 75,
        execution: 70,
      });

      // Should not recommend module 1 since it's complete
      expect(recommendations).not.toContain('module-1-foundation');
    });
  });

  describe('Data Persistence', () => {
    it('should persist progress to localStorage', () => {
      const { result: result1 } = renderHook(() => useTrainingStore());

      act(() => {
        result1.current.completeModule('module-1-foundation');
      });

      // Simulate page reload by creating new hook instance
      const { result: result2 } = renderHook(() => useTrainingStore());

      // Progress should be persisted
      expect(result2.current.isModuleComplete('module-1-foundation')).toBe(true);
    });
  });

  describe('Progress Dashboard Integration', () => {
    it('should show accurate module counts', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
      });

      // Check that progress calculations work correctly
      const completedModules = Object.keys({
        'module-1-foundation': true,
        'module-2-mythbusting': true,
        'module-3-strategy': false,
        'module-4-execution': false,
        'module-5-mastery': false,
      }).filter(m => useTrainingStore.getState().isModuleComplete(m));

      expect(completedModules.length).toBe(2);
    });
  });
});

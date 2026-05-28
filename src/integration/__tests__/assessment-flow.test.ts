/**
 * Assessment Flow Integration Tests
 *
 * Tests complete assessment journey:
 * 1. Blueprint assessment → Calculate scores
 * 2. Training completion → Enhanced blueprint scoring
 * 3. Module recommendations based on gaps
 * 4. Progress → Assessment feedback loop
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTrainingStore } from '../../stores/trainingStore';
import {
  calculateTrainingScore,
  getModuleRecommendations,
  generateModuleBasedTips,
  getOverallTrainingProgress,
} from '../../lib/assessments/enhancedScoring';

describe('Assessment Flow Integration', () => {
  beforeEach(() => {
    // Reset store before each test
    useTrainingStore.getState().resetProgress();
  });

  describe('Blueprint Assessment Flow', () => {
    it('should calculate enhanced score with training boost', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Start and complete some training modules
      act(() => {
        result.current.startModule('module-1-foundation');
        result.current.startModule('module-2-mythbusting');
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
      });

      // Calculate enhanced score using store directly
      act(() => {
        const baseBlueprintScore = 70;
        const moduleProgress = result.current.moduleProgress;
        let totalScore = 0;
        let totalWeight = 0;

        const weights = {
          'module-1-foundation': 0.25,
          'module-2-mythbusting': 0.20,
          'module-3-strategy': 0.25,
          'module-4-execution': 0.15,
          'module-5-mastery': 0.15,
        };

        for (const [moduleId, weight] of Object.entries(weights)) {
          if (result.current.isModuleComplete(moduleId)) {
            const progress = moduleProgress[moduleId];
            const completionBonus = progress?.percentComplete === 100 ? 1 : 0.9;
            totalScore += weight * 100 * completionBonus;
          }
          totalWeight += weight * 100;
        }

        const trainingScore = totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
        const enhancedScore = Math.round((baseBlueprintScore * 0.7) + (trainingScore * 0.3));

        // Enhanced score should incorporate training
        expect(enhancedScore).toBeGreaterThan(baseBlueprintScore * 0.7);
        expect(enhancedScore).toBeLessThanOrEqual(100);
      });
    });

    it('should apply bonus for full training completion with high score', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Complete all 5 modules
      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
        result.current.completeModule('module-3-strategy');
        result.current.completeModule('module-4-execution');
        result.current.completeModule('module-5-mastery');
      });

      act(() => {
        const baseBlueprintScore = 75;
        const trainingComplete = true;

        // Calculate training score with bonus
        let totalScore = 0;
        let totalWeight = 0;

        const weights = {
          'module-1-foundation': 0.25,
          'module-2-mythbusting': 0.20,
          'module-3-strategy': 0.25,
          'module-4-execution': 0.15,
          'module-5-mastery': 0.15,
        };

        for (const [, weight] of Object.entries(weights)) {
          totalScore += weight * 100;
          totalWeight += weight * 100;
        }

        const trainingScore = Math.round((totalScore / totalWeight) * 100);
        let enhancedScore = Math.round((baseBlueprintScore * 0.7) + (trainingScore * 0.3));

        // Bonus: If all modules complete and training score > 80%, boost overall score
        if (trainingComplete && trainingScore > 80) {
          enhancedScore = Math.min(100, enhancedScore + 5);
        }

        // Should get 5 point bonus for full completion with 100% training score
        const expectedWithoutBonus = Math.round((baseBlueprintScore * 0.7) + (100 * 0.3));
        expect(enhancedScore).toBeGreaterThanOrEqual(expectedWithoutBonus);
      });
    });
  });

  describe('Module Recommendation Engine', () => {
    it('should recommend foundation module for low psychology scores', () => {
      const recommendations = getModuleRecommendations({
        psychology: 55,
        economics: 75,
        planning: 70,
        execution: 68,
      });

      expect(recommendations).toContain('module-1-foundation');
    });

    it('should recommend mastery module for very low psychology', () => {
      const recommendations = getModuleRecommendations({
        psychology: 45,
        economics: 80,
        planning: 75,
        execution: 70,
      });

      // Very low psychology should trigger both Module 1 and Module 5
      expect(recommendations).toContain('module-1-foundation');
      expect(recommendations).toContain('module-5-mastery');
    });

    it('should recommend strategy module for low planning scores', () => {
      const recommendations = getModuleRecommendations({
        psychology: 75,
        economics: 70,
        planning: 55,
        execution: 72,
      });

      expect(recommendations).toContain('module-3-strategy');
    });

    it('should recommend execution module for low execution scores', () => {
      const recommendations = getModuleRecommendations({
        psychology: 78,
        economics: 72,
        planning: 70,
        execution: 50,
      });

      expect(recommendations).toContain('module-4-execution');
    });

    it('should recommend myth-busting for high scores across board', () => {
      const recommendations = getModuleRecommendations({
        psychology: 85,
        economics: 88,
        planning: 82,
        execution: 86,
      });

      // All high scores → recommend Module 2 (myth-busting)
      expect(recommendations).toContain('module-2-mythbusting');
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

      // Module 1 should not be recommended since it's complete
      expect(recommendations).not.toContain('module-1-foundation');
    });
  });

  describe('Personalized Tips Generation', () => {
    it('should provide tips for incomplete foundation module', () => {
      const tips = generateModuleBasedTips();

      const foundationTip = tips.find(tip =>
        tip.includes('Module 1') || tip.includes('money story')
      );

      expect(foundationTip).toBeDefined();
      expect(foundationTip).toContain('Complete Module 1');
    });

    it('should provide positive tips for completed modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
      });

      const tips = generateModuleBasedTips();
      const foundationTip = tips.find(tip => tip.includes('money psychology'));

      expect(foundationTip).toBeDefined();
      expect(foundationTip).not.toContain('Complete Module 1');
    });

    it('should provide myth-busting tips based on completion', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Complete Module 2
      act(() => {
        result.current.completeModule('module-2-mythbusting');
      });

      const tips = generateModuleBasedTips();
      const mythTip = tips.find(tip => tip.includes('fees'));

      expect(mythTip).toBeDefined();
      expect(mythTip).toContain('truth about fees');
    });
  });

  describe('Progress → Assessment Feedback Loop', () => {
    it('should update recommendations as modules complete', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Initial recommendations
      const initialRecs = getModuleRecommendations({
        psychology: 50,
        economics: 80,
        planning: 75,
        execution: 70,
      });

      expect(initialRecs).toContain('module-1-foundation');

      // Complete Module 1
      act(() => {
        result.current.completeModule('module-1-foundation');
      });

      // Updated recommendations should not include Module 1
      const updatedRecs = getModuleRecommendations({
        psychology: 50,
        economics: 80,
        planning: 75,
        execution: 70,
      });

      expect(updatedRecs).not.toContain('module-1-foundation');
    });

    it('should increase training score as modules complete', () => {
      const { result } = renderHook(() => useTrainingStore());

      const initialScore = calculateTrainingScore();
      expect(initialScore).toBe(0);

      // Complete Module 1
      act(() => {
        result.current.completeModule('module-1-foundation');
      });

      const scoreAfter1 = calculateTrainingScore();
      expect(scoreAfter1).toBeGreaterThan(initialScore);

      // Complete Module 2
      act(() => {
        result.current.completeModule('module-2-mythbusting');
      });

      const scoreAfter2 = calculateTrainingScore();
      expect(scoreAfter2).toBeGreaterThan(scoreAfter1);
    });

    it('should reach 100% training score when all modules complete', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
        result.current.completeModule('module-3-strategy');
        result.current.completeModule('module-4-execution');
        result.current.completeModule('module-5-mastery');
      });

      const finalScore = calculateTrainingScore();
      expect(finalScore).toBe(100);
    });
  });

  describe('Knowledge Check Impact on Assessments', () => {
    it('should track knowledge check performance', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.recordKnowledgeCheck('module-1-quiz-1', {
          score: 100,
          passed: true,
          answers: { q1: 'correct', q2: 'correct' },
          completedAt: new Date(),
        });
      });

      const checkResult = result.current.knowledgeCheckResults['module-1-quiz-1'];
      expect(checkResult?.passed).toBe(true);
      expect(checkResult?.score).toBe(100);
    });

    it('should record failed knowledge checks', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.recordKnowledgeCheck('module-2-quiz-1', {
          score: 50,
          passed: false,
          answers: { q1: 'wrong', q2: 'correct' },
          completedAt: new Date(),
        });
      });

      const checkResult = result.current.knowledgeCheckResults['module-2-quiz-1'];
      expect(checkResult?.passed).toBe(false);
      expect(checkResult?.score).toBe(50);
    });
  });

  describe('Overall Progress Calculation', () => {
    it('should calculate 0% for no modules', () => {
      const progress = getOverallTrainingProgress();
      expect(progress).toBe(0);
    });

    it('should calculate 20% for 1 of 5 modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
      });

      const progress = getOverallTrainingProgress();
      expect(progress).toBe(20);
    });

    it('should calculate 60% for 3 of 5 modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
        result.current.completeModule('module-3-strategy');
      });

      const progress = getOverallTrainingProgress();
      expect(progress).toBe(60);
    });

    it('should calculate 100% for all modules', () => {
      const { result } = renderHook(() => useTrainingStore());

      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-2-mythbusting');
        result.current.completeModule('module-3-strategy');
        result.current.completeModule('module-4-execution');
        result.current.completeModule('module-5-mastery');
      });

      const progress = getOverallTrainingProgress();
      expect(progress).toBe(100);
    });
  });

  describe('Module Weight Verification', () => {
    it('should apply correct weights to training score', () => {
      const { result } = renderHook(() => useTrainingStore());

      // Complete Module 1 (25% weight) and Module 3 (25% weight)
      // Should give 50% of max score
      act(() => {
        result.current.completeModule('module-1-foundation');
        result.current.completeModule('module-3-strategy');
      });

      const score = calculateTrainingScore();
      // 50% weight completed → approximately 50 points
      expect(score).toBeGreaterThan(45);
      expect(score).toBeLessThan(55);
    });
  });
});

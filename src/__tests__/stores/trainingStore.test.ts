/**
 * Test suite for trainingStore.ts
 *
 * Tests the Zustand store for training progress tracking
 */

import { act } from '@testing-library/react';
import { useTrainingStore } from '../../stores/trainingStore';

describe('trainingStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useTrainingStore.getState().resetProgress();
  });

  describe('startModule', () => {
    it('should create progress for a new module', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(progress).toBeDefined();
      expect(progress?.startedAt).toBeDefined();
      expect(progress?.screensCompleted).toEqual([]);
      expect(progress?.percentComplete).toBe(0);
    });

    it('should set current module when starting', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
      });

      expect(useTrainingStore.getState().currentModule).toBe(moduleId);
    });

    it('should not overwrite existing module progress', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        // Simulate some progress
        useTrainingStore.getState().recordScreenProgress(moduleId, 'screen-1');
      });

      const firstProgress = useTrainingStore.getState().getModuleProgress(moduleId);

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
      });

      const secondProgress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(secondProgress?.startedAt).toBe(firstProgress?.startedAt);
    });
  });

  describe('recordScreenProgress', () => {
    it('should add screen to completed screens', () => {
      const moduleId = 'module-1-foundation';
      const screenId = 'screen-1';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().recordScreenProgress(moduleId, screenId);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(progress?.screensCompleted).toContain(screenId);
    });

    it('should update current screen', () => {
      const moduleId = 'module-1-foundation';
      const screenId = 'screen-1';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().recordScreenProgress(moduleId, screenId);
      });

      expect(useTrainingStore.getState().currentScreen).toBe(screenId);
    });

    it('should not duplicate completed screens', () => {
      const moduleId = 'module-1-foundation';
      const screenId = 'screen-1';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().recordScreenProgress(moduleId, screenId);
        useTrainingStore.getState().recordScreenProgress(moduleId, screenId);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      const count = progress?.screensCompleted.filter(s => s === screenId).length || 0;
      expect(count).toBe(1);
    });

    it('should calculate percentComplete when totalScreens is provided', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().recordScreenProgress(moduleId, 'screen-1', 5);
        useTrainingStore.getState().recordScreenProgress(moduleId, 'screen-2', 5);
        useTrainingStore.getState().recordScreenProgress(moduleId, 'screen-3', 5);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(progress?.percentComplete).toBe(60); // 3 out of 5 screens
    });
  });

  describe('completeModule', () => {
    it('should mark module as completed', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().completeModule(moduleId);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(progress?.completedAt).toBeDefined();
    });

    it('should set percentComplete to 100', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().completeModule(moduleId);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(progress?.percentComplete).toBe(100);
    });

    it('should add achievement to achievements array', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().completeModule(moduleId);
      });

      const achievements = useTrainingStore.getState().achievements;
      expect(achievements).toHaveLength(1);
      expect(achievements[0].moduleId).toBe(moduleId);
      expect(achievements[0].badge).toBeDefined();
    });
  });

  describe('recordKnowledgeCheckResult', () => {
    it('should store knowledge check results', () => {
      const checkId = 'check-1';
      const result = {
        score: 80,
        passed: true,
        answers: { q1: 'a', q2: 'b' },
        completedAt: new Date(),
        timeSpentSeconds: 120
      };

      act(() => {
        useTrainingStore.getState().recordKnowledgeCheckResult(checkId, result);
      });

      const checkResults = useTrainingStore.getState().knowledgeCheckResults;
      expect(checkResults[checkId]).toEqual(result);
    });

    it('should allow updating existing check results', () => {
      const checkId = 'check-1';
      const result1 = {
        score: 80,
        passed: true,
        answers: { q1: 'a' },
        completedAt: new Date()
      };
      const result2 = {
        score: 90,
        passed: true,
        answers: { q1: 'b' },
        completedAt: new Date()
      };

      act(() => {
        useTrainingStore.getState().recordKnowledgeCheckResult(checkId, result1);
        useTrainingStore.getState().recordKnowledgeCheckResult(checkId, result2);
      });

      const checkResults = useTrainingStore.getState().knowledgeCheckResults;
      expect(checkResults[checkId].score).toBe(90);
      expect(checkResults[checkId].answers.q1).toBe('b');
    });
  });

  describe('saveReflection', () => {
    it('should store reflection response', () => {
      const promptId = 'prompt-1';
      const response = 'This is my reflection';

      act(() => {
        useTrainingStore.getState().saveReflection(promptId, response);
      });

      const reflections = useTrainingStore.getState().reflections;
      expect(reflections[promptId]).toBeDefined();
      expect(reflections[promptId].response).toBe(response);
    });

    it('should update existing reflection', () => {
      const promptId = 'prompt-1';
      const response1 = 'First reflection';
      const response2 = 'Updated reflection';

      act(() => {
        useTrainingStore.getState().saveReflection(promptId, response1);
        useTrainingStore.getState().saveReflection(promptId, response2);
      });

      const reflections = useTrainingStore.getState().reflections;
      expect(reflections[promptId].response).toBe(response2);
    });

    it('should track updatedAt timestamp', () => {
      const promptId = 'prompt-1';
      const response = 'My reflection';

      act(() => {
        useTrainingStore.getState().saveReflection(promptId, response);
      });

      const reflections = useTrainingStore.getState().reflections;
      expect(reflections[promptId].updatedAt).toBeDefined();
    });
  });

  describe('setCurrentModule and setCurrentScreen', () => {
    it('should set current module', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().setCurrentModule(moduleId);
      });

      expect(useTrainingStore.getState().currentModule).toBe(moduleId);
    });

    it('should set current screen', () => {
      const screenId = 'screen-1';

      act(() => {
        useTrainingStore.getState().setCurrentScreen(screenId);
      });

      expect(useTrainingStore.getState().currentScreen).toBe(screenId);
    });
  });

  describe('resetProgress', () => {
    it('should reset specific module when moduleId is provided', () => {
      const module1 = 'module-1-foundation';
      const module2 = 'module-2-myth-busting';

      act(() => {
        useTrainingStore.getState().startModule(module1);
        useTrainingStore.getState().startModule(module2);
        useTrainingStore.getState().resetProgress(module1);
      });

      expect(useTrainingStore.getState().getModuleProgress(module1)).toBeUndefined();
      expect(useTrainingStore.getState().getModuleProgress(module2)).toBeDefined();
    });

    it('should reset all progress when no moduleId is provided', () => {
      const module1 = 'module-1-foundation';
      const module2 = 'module-2-myth-busting';

      act(() => {
        useTrainingStore.getState().startModule(module1);
        useTrainingStore.getState().startModule(module2);
        useTrainingStore.getState().resetProgress();
      });

      expect(useTrainingStore.getState().moduleProgress).toEqual({});
      expect(useTrainingStore.getState().knowledgeCheckResults).toEqual({});
      expect(useTrainingStore.getState().reflections).toEqual({});
      expect(useTrainingStore.getState().achievements).toEqual([]);
      expect(useTrainingStore.getState().currentModule).toBeNull();
      expect(useTrainingStore.getState().currentScreen).toBeNull();
    });

    it('should clear localStorage on full reset', () => {
      act(() => {
        useTrainingStore.getState().startModule('module-1-foundation');
        useTrainingStore.getState().resetProgress();
      });

      expect(localStorage.getItem('your-wealth-training')).toBeNull();
    });
  });

  describe('getModuleProgress', () => {
    it('should return undefined for non-existent module', () => {
      const progress = useTrainingStore.getState().getModuleProgress('non-existent');
      expect(progress).toBeUndefined();
    });

    it('should return progress for existing module', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
      });

      const progress = useTrainingStore.getState().getModuleProgress(moduleId);
      expect(progress).toBeDefined();
    });
  });

  describe('isModuleComplete', () => {
    it('should return false for non-existent module', () => {
      const isComplete = useTrainingStore.getState().isModuleComplete('non-existent');
      expect(isComplete).toBe(false);
    });

    it('should return false for incomplete module', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
      });

      const isComplete = useTrainingStore.getState().isModuleComplete(moduleId);
      expect(isComplete).toBe(false);
    });

    it('should return true for completed module', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().completeModule(moduleId);
      });

      const isComplete = useTrainingStore.getState().isModuleComplete(moduleId);
      expect(isComplete).toBe(true);
    });
  });

  describe('persist middleware', () => {
    it('should persist state to localStorage', () => {
      const moduleId = 'module-1-foundation';

      act(() => {
        useTrainingStore.getState().startModule(moduleId);
        useTrainingStore.getState().recordScreenProgress(moduleId, 'screen-1', 5);
      });

      const stored = localStorage.getItem('your-wealth-training');
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.moduleProgress[moduleId]).toBeDefined();
    });
  });
});

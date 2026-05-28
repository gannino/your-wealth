import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Training progress tracking interface
 */
export interface ModuleProgress {
  startedAt: Date;
  completedAt?: Date;
  currentScreen: string;
  screensCompleted: string[];
  percentComplete: number;
}

/**
 * Knowledge check result interface
 */
export interface KnowledgeCheckResult {
  score: number;
  passed: boolean;
  answers: Record<string, string>;
  completedAt: Date;
  timeSpentSeconds?: number;
}

/**
 * Reflection response interface
 */
export interface Reflection {
  response: string;
  updatedAt: Date;
}

/**
 * Achievement interface
 */
export interface Achievement {
  moduleId: string;
  badge: string;
  earnedAt: Date;
}

/**
 * Training store state interface
 */
interface TrainingStore {
  // State
  moduleProgress: Record<string, ModuleProgress>;
  knowledgeCheckResults: Record<string, KnowledgeCheckResult>;
  reflections: Record<string, Reflection>;
  achievements: Achievement[];
  currentModule: string | null;
  currentScreen: string | null;

  // Actions
  startModule: (moduleId: string) => void;
  recordScreenProgress: (moduleId: string, screenId: string, totalScreens?: number) => void;
  completeModule: (moduleId: string) => void;
  recordKnowledgeCheckResult: (checkId: string, result: KnowledgeCheckResult) => void;
  saveReflection: (promptId: string, response: string) => void;
  setCurrentModule: (moduleId: string | null) => void;
  setCurrentScreen: (screenId: string | null) => void;
  resetProgress: (moduleId?: string) => void;
  getModuleProgress: (moduleId: string) => ModuleProgress | undefined;
  isModuleComplete: (moduleId: string) => boolean;
}

/**
 * Training store - manages progress for training modules
 */
export const useTrainingStore = create<TrainingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      moduleProgress: {},
      knowledgeCheckResults: {},
      reflections: {},
      achievements: [],
      currentModule: null,
      currentScreen: null,

      // Start a training module
      startModule: (moduleId: string) => {
        const state = get();

        // Don't overwrite existing progress
        if (state.moduleProgress[moduleId]) {
          set({ currentModule: moduleId });
          return;
        }

        set({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              startedAt: new Date(),
              currentScreen: '',
              screensCompleted: [],
              percentComplete: 0,
            },
          },
          currentModule: moduleId,
        });
      },

      // Record progress through screens
      recordScreenProgress: (moduleId: string, screenId: string, totalScreens?: number) => {
        const state = get();
        const progress = state.moduleProgress[moduleId];

        if (!progress) return;

        // Add screen if not already completed
        const screensCompleted = progress.screensCompleted.includes(screenId)
          ? progress.screensCompleted
          : [...progress.screensCompleted, screenId];

        // Calculate percentage
        let percentComplete = progress.percentComplete;
        if (totalScreens && totalScreens > 0) {
          percentComplete = Math.round((screensCompleted.length / totalScreens) * 100);
        }

        set({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              ...progress,
              currentScreen: screenId,
              screensCompleted,
              percentComplete,
            },
          },
          currentScreen: screenId,
        });
      },

      // Mark module as completed
      completeModule: (moduleId: string) => {
        const state = get();
        const progress = state.moduleProgress[moduleId];

        if (!progress) return;

        const achievement: Achievement = {
          moduleId,
          badge: `Module ${moduleId.split('-')[1]} Completed`,
          earnedAt: new Date(),
        };

        set({
          moduleProgress: {
            ...state.moduleProgress,
            [moduleId]: {
              ...progress,
              completedAt: new Date(),
              percentComplete: 100,
            },
          },
          achievements: [...state.achievements, achievement],
        });
      },

      // Record knowledge check results
      recordKnowledgeCheckResult: (checkId: string, result: KnowledgeCheckResult) => {
        set({
          knowledgeCheckResults: {
            ...get().knowledgeCheckResults,
            [checkId]: result,
          },
        });
      },

      // Save reflection response
      saveReflection: (promptId: string, response: string) => {
        set({
          reflections: {
            ...get().reflections,
            [promptId]: {
              response,
              updatedAt: new Date(),
            },
          },
        });
      },

      // Set current module
      setCurrentModule: (moduleId: string | null) => {
        set({ currentModule: moduleId });
      },

      // Set current screen
      setCurrentScreen: (screenId: string | null) => {
        set({ currentScreen: screenId });
      },

      // Reset progress (all or specific module)
      resetProgress: (moduleId?: string) => {
        if (moduleId) {
          // Reset specific module
          const state = get();
          const remainingProgress = Object.fromEntries(
            Object.entries(state.moduleProgress).filter(([key]) => key !== moduleId)
          );

          set({
            moduleProgress: remainingProgress,
            achievements: state.achievements.filter(a => a.moduleId !== moduleId),
          });
        } else {
          // Reset all progress
          set({
            moduleProgress: {},
            knowledgeCheckResults: {},
            reflections: {},
            achievements: [],
            currentModule: null,
            currentScreen: null,
          });
          // Clear from localStorage
          localStorage.removeItem('your-wealth-training');
        }
      },

      // Get progress for a specific module
      getModuleProgress: (moduleId: string) => {
        return get().moduleProgress[moduleId];
      },

      // Check if module is complete
      isModuleComplete: (moduleId: string) => {
        const progress = get().moduleProgress[moduleId];
        return progress?.completedAt !== undefined;
      },
    }),
    {
      name: 'your-wealth-training',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Export the store instance for direct access (needed for utility functions)
export default useTrainingStore;

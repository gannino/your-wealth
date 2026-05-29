import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfile, PsychologyAssessment, BlueprintAssessment, MindsetAssessment, FinancialData } from '../types';
export type { ModuleProgress, KnowledgeCheckResult, Reflection, Achievement } from './trainingStore';

interface UserStore extends UserProfile {
  setProfile: (profile: Partial<UserProfile>) => void;
  updateLastVisit: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      id: 'local',
      name: '',
      email: '',
      createdAt: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      setProfile: (profile) => set((state) => ({ ...state, ...profile })),
      updateLastVisit: () => set({ lastVisit: new Date().toISOString() }),
    }),
    {
      name: 'your-wealth-user',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

interface PsychologyStore extends PsychologyAssessment {
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  deduplicateSteps: () => void;
  setMindsetResponses: (responses: Record<string, number>) => void;
  clearMindsetResponses: () => void;
  getMindsetScore: () => number;
  addLimitingBelief: (belief: string) => void;
  addEmpoweringBelief: (belief: string) => void;
  addActionCommitment: (commitment: string, deadline: string) => void;
  resetTraining: () => void;
  trainingProgress: {
    mindsetModule: boolean;
    financialModule: boolean;
    assessmentModule: boolean;
  };
  reflectionResponses: Record<string, string>;
  setTrainingProgress: (module: 'mindsetModule' | 'financialModule' | 'assessmentModule', complete: boolean) => void;
  setReflectionResponse: (key: string, value: string) => void;
}

export const usePsychologyStore = create<PsychologyStore>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      stepsCompleted: [],
      mindsetResponses: {},
      limitingBeliefs: [],
      empoweringBeliefs: [],
      actionCommitments: [],
      trainingProgress: {
        mindsetModule: false,
        financialModule: false,
        assessmentModule: false,
      },
      reflectionResponses: {},
      setCurrentStep: (step) => set({ currentStep: step }),
      completeStep: (step) => set((state) => ({
        stepsCompleted: state.stepsCompleted.includes(step)
          ? state.stepsCompleted
          : [...state.stepsCompleted, step],
      })),
      deduplicateSteps: () => set((state) => ({
        stepsCompleted: [...new Set(state.stepsCompleted)].sort((a, b) => a - b),
      })),
      setMindsetResponses: (responses) => set({ mindsetResponses: responses }),
      clearMindsetResponses: () => set({
        mindsetResponses: {},
        currentStep: 0,
      }),
      getMindsetScore: () => {
        const responses = get().mindsetResponses;
        const entries = Object.entries(responses);

        if (entries.length === 0) return 0;

        // Questions q4 and q5 are positive statements, so their scores need to be inverted
        let adjustedScore = 0;
        entries.forEach(([questionId, value]) => {
          if (questionId === 'q4' || questionId === 'q5') {
            // Invert score for positive mindset questions
            adjustedScore += (6 - value);
          } else {
            // Use original score for negative mindset questions
            adjustedScore += value;
          }
        });

        const maxScore = entries.length * 5;
        const percentage = (adjustedScore / maxScore) * 100;
        return Math.round(percentage);
      },
      addLimitingBelief: (belief) => set((state) => ({
        limitingBeliefs: [
          ...state.limitingBeliefs,
          { belief, date: new Date().toISOString() },
        ],
      })),
      addEmpoweringBelief: (belief) => set((state) => ({
        empoweringBeliefs: [
          ...state.empoweringBeliefs,
          { belief, date: new Date().toISOString() },
        ],
      })),
      addActionCommitment: (commitment, deadline) => set((state) => ({
        actionCommitments: [
          ...state.actionCommitments,
          { commitment, deadline },
        ],
      })),
      setTrainingProgress: (module, complete) => set((state) => ({
        trainingProgress: {
          ...state.trainingProgress,
          [module]: complete,
        },
      })),
      setReflectionResponse: (key, value) => set((state) => ({
        reflectionResponses: {
          ...state.reflectionResponses,
          [key]: value,
        },
      })),
      resetTraining: () => {
        // Clear state
        set({
          currentStep: 0,
          stepsCompleted: [],
          mindsetResponses: {},
          limitingBeliefs: [],
          empoweringBeliefs: [],
          actionCommitments: [],
          trainingProgress: {
            mindsetModule: false,
            financialModule: false,
            assessmentModule: false,
          },
          reflectionResponses: {},
        });
        // Clear from localStorage
        localStorage.removeItem('your-wealth-psychology');
      },
    }),
    {
      name: 'your-wealth-psychology',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Automatically deduplicate steps when loading from localStorage
        if (state && state.stepsCompleted.length !== new Set(state.stepsCompleted).size) {
          state.deduplicateSteps();
        }
      },
    }
  )
);

interface AssessmentStore {
  blueprintAssessment: BlueprintAssessment | null;
  mindsetAssessment: MindsetAssessment | null;
  setBlueprintAssessment: (assessment: BlueprintAssessment | null) => void;
  setMindsetAssessment: (assessment: MindsetAssessment | null) => void;
  getBlueprintScores: () => { psychologyScore: number; economicsScore: number; sophisticationScore: number; executionScore: number; overallScore: number } | null;
}

interface FinancialPlanStore {
  financialData: FinancialData | null;
  currency: string;
  customReturnRates: Record<'conservative' | 'current' | 'aggressive', number>;
  withdrawalRate: number;
  useMonthlyCompounding: boolean;
  // UK FIRE mode fields
  isUKMode: boolean;
  ukSpending?: {
    housing: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
    bills: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
    transport: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
    food: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
    fun: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
    subscriptions: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
    other: { monthly_gbp: number; confidence: 'high' | 'medium' | 'low' };
  };
  ukAssets?: {
    cashSavings: number;
    isaBalance: number;
    pensionTotal: number;
    otherInvestments: number;
    propertyEquity: number;
  };
  ukDebts?: Array<{
    type: 'credit_card' | 'bnpl' | 'personal_loan' | 'student_loan' | 'mortgage';
    balance: number;
    apr: number;
  }>;
  ukGoals?: {
    targetRetirementAge: number;
    lifestyleBand: 'modest' | 'comfortable' | 'generous';
    targetAnnualSpend_gbp?: number;
  };
  setFinancialData: (data: FinancialData | null) => void;
  setCurrency: (currency: string) => void;
  setCustomReturnRates: (rates: Record<'conservative' | 'current' | 'aggressive', number>) => void;
  setWithdrawalRate: (rate: number) => void;
  setUseMonthlyCompounding: (useMonthly: boolean) => void;
  setUKSpending: (spending: FinancialPlanStore['ukSpending']) => void;
  setUKAssets: (assets: FinancialPlanStore['ukAssets']) => void;
  setUKDebts: (debts: FinancialPlanStore['ukDebts']) => void;
  setUKGoals: (goals: FinancialPlanStore['ukGoals']) => void;
  setUKMode: (isUKMode: boolean) => void;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set, get) => ({
      blueprintAssessment: null,
      mindsetAssessment: null,
      setBlueprintAssessment: (assessment) => set({ blueprintAssessment: assessment }),
      setMindsetAssessment: (assessment) => set({ mindsetAssessment: assessment }),
      getBlueprintScores: () => {
        const assessment = get().blueprintAssessment;
        if (!assessment) return null;

        // Blueprint questions data (must match BlueprintAssessment.tsx)
        const blueprintQuestions = [
          // Psychology Questions
          { id: 'p1', category: 'psychology', inverse: false },
          { id: 'p2', category: 'psychology', inverse: false },
          { id: 'p3', category: 'psychology', inverse: false },
          { id: 'p4', category: 'psychology', inverse: false },
          { id: 'p5', category: 'psychology', inverse: false },
          { id: 'p6', category: 'psychology', inverse: false },
          { id: 'p7', category: 'psychology', inverse: false },
          { id: 'p8', category: 'psychology', inverse: true },
          { id: 'p9', category: 'psychology', inverse: true },
          { id: 'p10', category: 'psychology', inverse: true },
          // Economics Questions
          { id: 'e1', category: 'economics', inverse: true },
          { id: 'e2', category: 'economics', inverse: true },
          { id: 'e3', category: 'economics', inverse: true },
          { id: 'e4', category: 'economics', inverse: true },
          { id: 'e5', category: 'economics', inverse: true },
          { id: 'e6', category: 'economics', inverse: true },
          { id: 'e7', category: 'economics', inverse: true },
          { id: 'e8', category: 'economics', inverse: true },
          { id: 'e9', category: 'economics', inverse: true },
          { id: 'e10', category: 'economics', inverse: true },
          // Sophistication Questions
          { id: 's1', category: 'sophistication', inverse: true },
          { id: 's2', category: 'sophistication', inverse: true },
          { id: 's3', category: 'sophistication', inverse: true },
          { id: 's4', category: 'sophistication', inverse: true },
          { id: 's5', category: 'sophistication', inverse: true },
          { id: 's6', category: 'sophistication', inverse: true },
          { id: 's7', category: 'sophistication', inverse: true },
          { id: 's8', category: 'sophistication', inverse: true },
          { id: 's9', category: 'sophistication', inverse: true },
          { id: 's10', category: 'sophistication', inverse: true },
          // Execution Questions
          { id: 'x1', category: 'execution', inverse: true },
          { id: 'x2', category: 'execution', inverse: true },
          { id: 'x3', category: 'execution', inverse: true },
          { id: 'x4', category: 'execution', inverse: true },
          { id: 'x5', category: 'execution', inverse: true },
          { id: 'x6', category: 'execution', inverse: true },
          { id: 'x7', category: 'execution', inverse: true },
          { id: 'x8', category: 'execution', inverse: true },
          { id: 'x9', category: 'execution', inverse: true },
          { id: 'x10', category: 'execution', inverse: true },
        ];

        const scores: Record<string, { sum: number; count: number }> = {
          psychology: { sum: 0, count: 0 },
          economics: { sum: 0, count: 0 },
          sophistication: { sum: 0, count: 0 },
          execution: { sum: 0, count: 0 },
        };

        blueprintQuestions.forEach((q) => {
          const answer = assessment.responses[q.id];
          if (answer !== undefined) {
            const adjustedAnswer = q.inverse ? answer : (6 - answer);
            const categoryScore = scores[q.category] || { sum: 0, count: 0 };
            categoryScore.sum += adjustedAnswer;
            categoryScore.count++;
          }
        });

        const psychologyScore = scores.psychology.count > 0 ? Math.round((scores.psychology.sum / scores.psychology.count) * 2) : 0;
        const economicsScore = scores.economics.count > 0 ? Math.round((scores.economics.sum / scores.economics.count) * 2) : 0;
        const sophisticationScore = scores.sophistication.count > 0 ? Math.round((scores.sophistication.sum / scores.sophistication.count) * 2) : 0;
        const executionScore = scores.execution.count > 0 ? Math.round((scores.execution.sum / scores.execution.count) * 2) : 0;
        const overallScore = Math.round(
          ((psychologyScore + economicsScore + sophisticationScore + executionScore) / 4) * 10
        );

        return {
          psychologyScore,
          economicsScore,
          sophisticationScore,
          executionScore,
          overallScore,
        };
      },
    }),
    {
      name: 'your-wealth-assessments',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        blueprintAssessment: state.blueprintAssessment,
        mindsetAssessment: state.mindsetAssessment,
      }),
    }
  )
);

export const useFinancialPlanStore = create<FinancialPlanStore>()(
  persist(
    (set) => ({
      financialData: null,
      currency: 'USD',
      customReturnRates: {
        conservative: 5,
        current: 7,
        aggressive: 9,
      },
      withdrawalRate: 5, // Default 5% withdrawal rate
      useMonthlyCompounding: true, // Default to monthly compounding (matches most financial apps)
      // UK FIRE mode state
      isUKMode: false,
      ukSpending: undefined,
      ukAssets: undefined,
      ukDebts: undefined,
      ukGoals: undefined,
      setFinancialData: (data) => set({ financialData: data }),
      setCurrency: (currency) => set({ currency }),
      setCustomReturnRates: (rates) => set({ customReturnRates: rates }),
      setWithdrawalRate: (rate) => set({ withdrawalRate: rate }),
      setUseMonthlyCompounding: (useMonthly) => set({ useMonthlyCompounding: useMonthly }),
      setUKSpending: (spending) => set({ ukSpending: spending }),
      setUKAssets: (assets) => set({ ukAssets: assets }),
      setUKDebts: (debts) => set({ ukDebts: debts }),
      setUKGoals: (goals) => set({ ukGoals: goals }),
      setUKMode: (isUKMode) => set({ isUKMode }),
    }),
    {
      name: 'your-wealth-financial-plan',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        financialData: state.financialData,
        currency: state.currency,
        customReturnRates: state.customReturnRates,
        withdrawalRate: state.withdrawalRate,
        useMonthlyCompounding: state.useMonthlyCompounding,
        isUKMode: state.isUKMode,
        ukSpending: state.ukSpending,
        ukAssets: state.ukAssets,
        ukDebts: state.ukDebts,
        ukGoals: state.ukGoals,
      }),
    }
  )
);

export { useTrainingStore } from './trainingStore';


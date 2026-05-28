/**
 * Enhanced Assessment Scoring
 *
 * Links training module progress to assessment scores.
 * Updates blueprint scoring based on knowledge check performance.
 */

import trainingStoreInstance from '../../stores/trainingStore';

/**
 * Module weight in overall assessment score
 *
 * Training completion accounts for 20% of overall financial sophistication
 */
export const MODULE_WEIGHTS: Record<string, number> = {
  'module-1-foundation': 0.25,
  'module-2-mythbusting': 0.20,
  'module-3-strategy': 0.25,
  'module-4-execution': 0.15,
  'module-5-mastery': 0.15,
};

/**
 * Calculate training completion score
 *
 * @returns Score from 0-100 based on module completion
 */
export function calculateTrainingScore(): number {
  // Use store instance directly instead of hook to avoid "Invalid hook call" errors
  const state = trainingStoreInstance.getState();
  const { isModuleComplete, moduleProgress } = state;

  let totalScore = 0;
  let totalWeight = 0;

  for (const [moduleId, weight] of Object.entries(MODULE_WEIGHTS)) {
    if (isModuleComplete(moduleId)) {
      // Bonus for modules with higher quiz performance
      const progress = moduleProgress[moduleId];
      const completionBonus = progress?.percentComplete === 100 ? 1 : 0.9;

      totalScore += weight * 100 * completionBonus;
    }
    totalWeight += weight * 100;
  }

  return totalWeight > 0 ? Math.round((totalScore / totalWeight) * 100) : 0;
}

/**
 * Get module completion status for assessment boost
 *
 * @param moduleId - Module ID to check
 * @returns true if module is complete, false otherwise
 */
export function isModuleCompletedForAssessment(moduleId: string): boolean {
  const state = trainingStoreInstance.getState();
  return state.isModuleComplete(moduleId);
}

/**
 * Calculate knowledge check performance score
 *
 * @param moduleId - Module ID to calculate score for
 * @returns Score from 0-100 based on quiz performance
 */
export function calculateKnowledgeCheckScore(moduleId: string): number {
  const state = trainingStoreInstance.getState();
  const { knowledgeCheckResults } = state;

  // Get all knowledge check results for this module
  const moduleChecks = Object.entries(knowledgeCheckResults)
    .filter(([checkId]) => checkId.startsWith(moduleId))
    .map(([, result]) => result);

  if (moduleChecks.length === 0) return 0;

  const passedCount = moduleChecks.filter(check => check.passed).length;
  return Math.round((passedCount / moduleChecks.length) * 100);
}

/**
 * Enhanced blueprint scoring that incorporates training
 *
 * @param baseScore - Original blueprint assessment score (0-100)
 * @param trainingComplete - Whether all 5 modules are complete
 * @returns Enhanced score (0-100)
 */
export function calculateEnhancedBlueprintScore(
  baseScore: number,
  trainingComplete: boolean
): number {
  const trainingScore = calculateTrainingScore();

  // Training accounts for 30% of enhanced score, blueprint for 70%
  const enhancedScore = Math.round(
    (baseScore * 0.7) + (trainingScore * 0.3)
  );

  // Bonus: If all modules complete and training score > 80%, boost overall score
  if (trainingComplete && trainingScore > 80) {
    return Math.min(100, enhancedScore + 5); // 5 point bonus
  }

  return enhancedScore;
}

/**
 * Get module recommendations based on assessment results
 *
 * @param blueprintScores - Blueprint quadrant scores
 * @returns Array of module IDs to recommend
 */
export function getModuleRecommendations(blueprintScores: {
  psychology: number;
  economics: number;
  planning: number;
  execution: number;
}): string[] {
  const recommendations: string[] = [];
  const state = trainingStoreInstance.getState();
  const { isModuleComplete } = state;

  // Low psychology score → recommend Module 1 and 5
  if (blueprintScores.psychology < 70 && !isModuleComplete('module-1-foundation')) {
    recommendations.push('module-1-foundation');
  }
  if (blueprintScores.psychology < 60 && !isModuleComplete('module-5-mastery')) {
    recommendations.push('module-5-mastery');
  }

  // Low planning score → recommend Module 3
  if (blueprintScores.planning < 70 && !isModuleComplete('module-3-strategy')) {
    recommendations.push('module-3-strategy');
  }

  // Low execution score → recommend Module 4
  if (blueprintScores.execution < 70 && !isModuleComplete('module-4-execution')) {
    recommendations.push('module-4-execution');
  }

  // If all scores high but not complete, recommend Module 2
  const allHigh = Object.values(blueprintScores).every(score => score >= 80);
  if (allHigh && !isModuleComplete('module-2-mythbusting')) {
    recommendations.push('module-2-mythbusting');
  }

  return recommendations;
}

/**
 * Generate personalized tips based on module progress
 *
 * @returns Array of personalized tips
 */
export function generateModuleBasedTips(): string[] {
  const state = trainingStoreInstance.getState();
  const { isModuleComplete } = state;
  const tips: string[] = [];

  // Module 1 tips
  if (isModuleComplete('module-1-foundation')) {
    tips.push('Your money psychology is strong. Apply the 80/20 principle to all financial decisions.');
  } else {
    tips.push('Complete Module 1 to understand your money story and transform limiting beliefs.');
  }

  // Module 2 tips
  if (isModuleComplete('module-2-mythbusting')) {
    tips.push('You know the truth about fees. Review your 401(k) and investment fees immediately.');
  } else {
    tips.push('Hidden fees are destroying your wealth. Module 2 shows you how to stop the bleeding.');
  }

  // Module 3 tips
  if (isModuleComplete('module-3-strategy')) {
    tips.push('Your asset allocation strategy is set. Remember to rebalance annually or when off by 5%+.');
  } else {
    tips.push('Proper allocation reduces risk while maximizing returns. Module 3 teaches you how.');
  }

  // Module 4 tips
  if (isModuleComplete('module-4-execution')) {
    tips.push('You can vet advisors properly. Ask the 7 Questions before hiring anyone.');
  } else {
    tips.push('Most advisors are brokers, not fiduciaries. Module 4 shows you the difference.');
  }

  // Module 5 tips
  if (isModuleComplete('module-5-mastery')) {
    tips.push('You understand market cycles. Stay the course during volatility - time in market beats timing.');
  } else {
    tips.push('Bear markets are buying opportunities. Module 5 teaches mastery of market psychology.');
  }

  return tips;
}

/**
 * Get overall training progress percentage
 *
 * @returns Percentage of modules completed (0-100)
 */
export function getOverallTrainingProgress(): number {
  const state = trainingStoreInstance.getState();
  const { moduleProgress } = state;

  const modules = Object.keys(MODULE_WEIGHTS);
  const totalModules = modules.length;
  const completedModules = modules.filter(m =>
    moduleProgress[m]?.percentComplete === 100
  ).length;

  return Math.round((completedModules / totalModules) * 100);
}

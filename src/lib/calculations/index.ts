// Export all calculation functions
export * from './compound-growth';
export * from './tax';
export * from './inflation';
export * from './retirement';
export * from './types';

/**
 * Financial scenario types
 */
export type ScenarioType = 'conservative' | 'current' | 'aggressive';

/**
 * Scenario return rates
 */
export const SCENARIO_RETURN_RATES: Record<ScenarioType, number> = {
  conservative: 0.05, // 5%
  current: 0.07, // 7%
  aggressive: 0.09, // 9%
};

/**
 * Generate a complete financial projection
 * @param financialData - User's financial data
 * @param scenario - Which scenario to generate
 * @param customReturnRate - Optional custom return rate (overrides scenario default)
 * @returns Complete projection data
 */
export function generateFinancialProjection(
  financialData: {
    currentBalance: number;
    annualIncome: number;
    monthlySavings: number;
    effectiveTaxRate: number;
    inflationRate: number;
    useMonthlyCompounding?: boolean;
  },
  scenario: ScenarioType,
  startYear: number = new Date().getFullYear(),
  projectionYears: number = 50,
  customReturnRate?: number,
  withdrawalRate?: number
) {
  const returnRate = customReturnRate ?? SCENARIO_RETURN_RATES[scenario];
  const effectiveWithdrawalRate = withdrawalRate ?? 0.05; // Default to 5% if not provided
  const annualSavings = financialData.monthlySavings * 12;
  const afterTaxAndSavings = financialData.annualIncome * (1 - financialData.effectiveTaxRate) - annualSavings;
  const useMonthlyCompounding = financialData.useMonthlyCompounding ?? true;

  // Calculate compound growth
  const balances = calculateCompoundGrowth(
    financialData.currentBalance,
    financialData.monthlySavings,
    returnRate,
    projectionYears,
    useMonthlyCompounding
  );

  // Generate yearly projections
  const projections = [];
  for (let year = 0; year < projectionYears; year++) {
    const projectedIncome = calculateIncomeGrowth(
      financialData.annualIncome,
      startYear,
      startYear + year
    );
    const netWorth = balances[year];
    const netWorthTodayValue = toTodayDollars(
      netWorth,
      financialData.inflationRate,
      startYear + year,
      startYear
    );

    projections.push({
      year: startYear + year,
      annualIncome: projectedIncome,
      annualSavings: annualSavings,
      afterTaxAndSavings: afterTaxAndSavings,
      criticalMass: netWorth * effectiveWithdrawalRate, // Use configurable withdrawal rate
      preTaxAnnualIncome: netWorth * effectiveWithdrawalRate,
      preTaxMonthlyIncome: (netWorth * effectiveWithdrawalRate) / 12,
      preTaxAnnualIncomeTodayValue: netWorthTodayValue * effectiveWithdrawalRate,
      netWorth,
      netWorthTodayValue,
      returnRate,
    });
  }

  return projections;
}

// Re-export types and functions needed
import {
  calculateCompoundGrowth,
} from './compound-growth';

import {} from './tax';

import {
  toTodayDollars,
} from './inflation';

import {
  calculateIncomeGrowth,
} from './retirement';

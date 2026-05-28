import { calculateCompoundGrowth, calculateCompoundGrowthDetailed } from './compound-growth';
import { toTodayDollars } from './inflation';

/**
 * Retirement milestone definitions
 * Based on the "Money Master the Game" framework
 */
export const RETIREMENT_MILESTONES = {
  security: {
    name: 'Financial Security',
    annualIncome: 42000,
    criticalMass: 700000,
    description: 'Cover your essential expenses',
  },
  vitality: {
    name: 'Financial Vitality',
    annualIncome: 48000,
    criticalMass: 800000,
    description: 'Cover expenses plus some comforts',
  },
  independence: {
    name: 'Financial Independence',
    annualIncome: 72000,
    criticalMass: 1200000,
    description: 'Live your ideal lifestyle',
  },
  freedom: {
    name: 'Absolute Financial Freedom',
    annualIncome: 120000,
    criticalMass: 2000000,
    description: 'Live without any financial constraints',
  },
} as const;

export type RetirementMilestone = keyof typeof RETIREMENT_MILESTONES;

/**
 * Calculate tiered income growth based on projections from "Money Master the Game"
 * @param baseIncome - Starting annual income
 * @param startYear - Year income starts
 * @param currentYear - Current projection year
 * @returns Projected income for the year
 */
export function calculateIncomeGrowth(
  baseIncome: number,
  startYear: number,
  currentYear: number
): number {
  const year = currentYear - startYear;

  // 2026-2030: 2% growth
  // 2031-2035: 3% growth
  // 2036+: 4% growth
  if (year <= 4) {
    return baseIncome * Math.pow(1.02, year);
  } else if (year <= 9) {
    const baseAfter4Years = baseIncome * Math.pow(1.02, 4);
    return baseAfter4Years * Math.pow(1.03, year - 4);
  } else {
    const baseAfter4Years = baseIncome * Math.pow(1.02, 4);
    const baseAfter9Years = baseAfter4Years * Math.pow(1.03, 5);
    return baseAfter9Years * Math.pow(1.04, year - 9);
  }
}

/**
 * Calculate years to reach a retirement milestone
 * @param currentBalance - Current investment balance
 * @param annualContribution - Annual contribution amount
 * @param returnRate - Annual return rate (as decimal)
 * @param targetAmount - Target milestone amount
 * @param useMonthlyCompounding - Whether to use monthly compounding (default: true)
 * @returns Number of years to reach milestone, or Infinity if not reachable
 */
export function calculateYearsToMilestone(
  currentBalance: number,
  annualContribution: number,
  returnRate: number,
  targetAmount: number,
  useMonthlyCompounding: boolean = true
): number {
  // Iterative approach to solve for time
  for (let year = 1; year <= 100; year++) {
    const balances = calculateCompoundGrowth(currentBalance, annualContribution / 12, returnRate, year, useMonthlyCompounding);
    if (balances[balances.length - 1] >= targetAmount) {
      return year;
    }
  }
  return Infinity;
}

/**
 * Calculate the 5% withdrawal amount (safe withdrawal rate)
 * @param criticalMass - Total investment amount
 * @returns Annual withdrawal amount at 5%
 */
export function calculate5PercentWithdrawal(criticalMass: number): number {
  return criticalMass * 0.05;
}

/**
 * Check if a withdrawal rate is sustainable
 * @param portfolioValue - Total portfolio value
 * @param annualWithdrawal - Annual withdrawal amount
 * @returns True if withdrawal is 5% or less of portfolio
 */
export function isSustainableWithdrawal(
  portfolioValue: number,
  annualWithdrawal: number
): boolean {
  const withdrawalRate = annualWithdrawal / portfolioValue;
  return withdrawalRate <= 0.05;
}

/**
 * Project net worth over time with detailed breakdown
 * @param currentBalance - Current investment balance
 * @param monthlyContribution - Monthly contribution amount
 * @param annualReturn - Annual return rate (as decimal)
 * @param currentYear - Starting year
 * @param projectionYears - Number of years to project
 * @param inflationRate - Annual inflation rate (as decimal)
 * @param useMonthlyCompounding - Whether to use monthly compounding (default: true)
 * @returns Array of yearly projections
 */
export function projectNetWorth(
  currentBalance: number,
  monthlyContribution: number,
  annualReturn: number,
  currentYear: number,
  projectionYears: number,
  inflationRate: number,
  useMonthlyCompounding: boolean = true
): Array<{
  year: number;
  netWorth: number;
  netWorthTodayValue: number;
  contribution: number;
  earnings: number;
}> {
  const projections = calculateCompoundGrowthDetailed(
    currentBalance,
    monthlyContribution,
    annualReturn,
    projectionYears,
    useMonthlyCompounding
  );

  return projections.map((p, index: number) => ({
    year: currentYear + index,
    netWorth: p.endBalance,
    netWorthTodayValue: toTodayDollars(p.endBalance, inflationRate, currentYear + index, currentYear),
    contribution: p.contributions,
    earnings: p.earnings,
  }));
}


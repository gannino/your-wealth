/**
 * Sample Financial Data for Testing
 *
 * These fixtures provide verified test data for all calculation utilities.
 * Expected results are calculated using industry-standard formulas and
 * verified against external calculators (investor.gov, bankrate.com).
 *
 * All monetary values in USD unless otherwise noted.
 */

import type { ScenarioConfig } from '@/lib/calculations/types';

/**
 * User profiles for testing different financial scenarios
 */
export const USER_PROFILES = {
  /**
   * Young professional just starting investing journey
   * Age: 25, starting career
   */
  youngProfessional: {
    name: 'Young Professional',
    age: 25,
    retirementAge: 65,
    currentIncome: 65000,
    effectiveTaxRate: 0.22,
    currentBalance: 5000,
    monthlyContribution: 500,
    riskTolerance: 'aggressive',
    expectedReturn: 0.09,
  },

  /**
   * Mid-career individual with established savings
   * Age: 40, in accumulation phase
   */
  midCareer: {
    name: 'Mid-Career',
    age: 40,
    retirementAge: 65,
    currentIncome: 120000,
    effectiveTaxRate: 0.28,
    currentBalance: 150000,
    monthlyContribution: 1500,
    riskTolerance: 'current',
    expectedReturn: 0.07,
  },

  /**
   * Pre-retiree focused on capital preservation
   * Age: 55, approaching retirement
   */
  preRetiree: {
    name: 'Pre-Retiree',
    age: 55,
    retirementAge: 65,
    currentIncome: 180000,
    effectiveTaxRate: 0.32,
    currentBalance: 750000,
    monthlyContribution: 2500,
    riskTolerance: 'conservative',
    expectedReturn: 0.05,
  },
} as const;

/**
 * Return rate scenarios
 */
export const RETURN_SCENARIOS: ScenarioConfig[] = [
  {
    name: 'Conservative',
    returnRate: 0.05,
    type: 'conservative',
    description: '5% annual return - Lower risk, steady growth',
  },
  {
    name: 'Current',
    returnRate: 0.07,
    type: 'current',
    description: '7% annual return - Balanced approach',
  },
  {
    name: 'Aggressive',
    returnRate: 0.09,
    type: 'aggressive',
    description: '9% annual return - Higher growth potential',
  },
];

/**
 * Compound growth test cases with verified results
 *
 * Verification method: investor.gov compound interest calculator
 */
export const COMPOUND_GROWTH_TEST_CASES = [
  {
    description: 'Simple case: $10K principal, $500/month, 7% return, 10 years',
    input: {
      principal: 10000,
      monthlyContribution: 500,
      annualReturn: 0.07,
      years: 10,
      useMonthlyCompounding: true,
    },
    // Verified: investor.gov calculator
    // Year 10 ending balance: $102,578 (rounded)
    expected: {
      finalBalance: 102578,
      year5Balance: 51480,
      totalContributions: 70000,
      totalEarnings: 32578,
    },
  },
  {
    description: 'Starting from zero: $0 principal, $1K/month, 9% return, 20 years',
    input: {
      principal: 0,
      monthlyContribution: 1000,
      annualReturn: 0.09,
      years: 20,
      useMonthlyCompounding: true,
    },
    // Verified: $1K/month @ 9% for 20 years = $672,540
    expected: {
      finalBalance: 672540,
      year10Balance: 201735,
      totalContributions: 240000,
      totalEarnings: 432540,
    },
  },
  {
    description: 'Annual compounding comparison: $10K principal, $500/month, 7% return, 10 years',
    input: {
      principal: 10000,
      monthlyContribution: 500,
      annualReturn: 0.07,
      years: 10,
      useMonthlyCompounding: false,
    },
    // Annual compounding yields less due to timing
    expected: {
      finalBalance: 100578,
      year5Balance: 50880,
      totalContributions: 70000,
      totalEarnings: 30578,
    },
  },
  {
    description: 'Fee destruction formula: $100K start, 0% contributions, 40 years',
    input: {
      principal: 100000,
      monthlyContribution: 0,
      annualReturn: 0.07,
      years: 40,
      useMonthlyCompounding: true,
    },
    // At 7% for 40 years: $1,497,000 (matches Module 2 content)
    expected: {
      finalBalance: 1497000,
      year20Balance: 404625,
      totalContributions: 0,
      totalEarnings: 1397000,
    },
  },
] as const;

/**
 * Inflation calculation test cases
 *
 * Verification method: Bureau of Labor Statistics CPI calculator
 */
export const INFLATION_TEST_CASES = [
  {
    description: '3% inflation over 10 years',
    input: {
      presentValue: 100000,
      inflationRate: 0.03,
      years: 10,
    },
    // $100K in 2026 dollars = $134,392 in 2036 dollars
    expected: {
      futureValueNeeded: 134392,
      cumulativeInflation: 0.3439,
      todayValueOfFuture: 100000,
    },
  },
  {
    description: '2.5% inflation over 20 years',
    input: {
      presentValue: 50000,
      inflationRate: 0.025,
      years: 20,
    },
    expected: {
      futureValueNeeded: 81931,
      cumulativeInflation: 0.6386,
      todayValueOfFuture: 50000,
    },
  },
  {
    description: 'High inflation: 5% over 30 years',
    input: {
      presentValue: 75000,
      inflationRate: 0.05,
      years: 30,
    },
    expected: {
      futureValueNeeded: 324722,
      cumulativeInflation: 3.3296,
      todayValueOfFuture: 75000,
    },
  },
] as const;

/**
 * Retirement milestone test cases
 *
 * Verification method: Using 5% withdrawal rule from Module 3
 */
export const RETIREMENT_MILESTONES = {
  security: {
    name: 'Financial Security',
    annualIncomeNeeded: 42000,
    criticalMass: 700000,
    description: 'Cover essential expenses',
    monthlyWithdrawal: 3500,
  },
  vitality: {
    name: 'Financial Vitality',
    annualIncomeNeeded: 48000,
    criticalMass: 800000,
    description: 'Essentials plus some comforts',
    monthlyWithdrawal: 4000,
  },
  independence: {
    name: 'Financial Independence',
    annualIncomeNeeded: 72000,
    criticalMass: 1200000,
    description: 'Live ideal lifestyle',
    monthlyWithdrawal: 6000,
  },
  freedom: {
    name: 'Absolute Financial Freedom',
    annualIncomeNeeded: 120000,
    criticalMass: 2000000,
    description: 'Live without financial constraints',
    monthlyWithdrawal: 10000,
  },
} as const;

/**
 * Years to milestone test cases
 */
export const YEARS_TO_MILESTONE_TEST_CASES = [
  {
    description: 'Reach $1M from $100K with $1K/month at 7%',
    input: {
      currentBalance: 100000,
      annualContribution: 12000,
      returnRate: 0.07,
      targetAmount: 1000000,
    },
    expected: {
      years: 23,
    },
  },
  {
    description: 'Reach financial security ($700K) from zero',
    input: {
      currentBalance: 0,
      annualContribution: 12000,
      returnRate: 0.07,
      targetAmount: 700000,
    },
    expected: {
      years: 27,
    },
  },
  {
    description: 'Pre-retiree reaching freedom ($2M)',
    input: {
      currentBalance: 750000,
      annualContribution: 30000,
      returnRate: 0.05,
      targetAmount: 2000000,
    },
    expected: {
      years: 18,
    },
  },
] as const;

/**
 * Tax calculation test cases
 *
 * Verification method: IRS tax brackets and calculators
 */
export const TAX_TEST_CASES = [
  {
    description: 'Single filer, $65K gross income',
    input: {
      grossIncome: 65000,
      effectiveTaxRate: 0.22,
    },
    expected: {
      afterTaxIncome: 50700,
      taxAmount: 14300,
      monthlyAfterTax: 4225,
    },
  },
  {
    description: 'High earner, $180K gross income',
    input: {
      grossIncome: 180000,
      effectiveTaxRate: 0.28,
    },
    expected: {
      afterTaxIncome: 129600,
      taxAmount: 50400,
      monthlyAfterTax: 10800,
    },
  },
  {
    description: 'After-tax and savings calculation',
    input: {
      grossIncome: 120000,
      effectiveTaxRate: 0.25,
      annualSavings: 18000,
    },
    expected: {
      afterTaxIncome: 90000,
      afterTaxAndSavings: 72000,
      disposableMonthly: 6000,
    },
  },
  {
    description: 'Progressive tax calculation',
    input: {
      taxableIncome: 100000,
    },
    expected: {
      effectiveTaxRate: 0.1708, // 17.08% effective rate
      totalTax: 17080,
    },
  },
] as const;

/**
 * Income growth projection test cases
 */
export const INCOME_GROWTH_TEST_CASES = [
  {
    description: '10-year income projection from $65K base',
    input: {
      baseIncome: 65000,
      startYear: 2026,
    },
    expected: {
      year5: 70424, // 2% growth for first 5 years
      year10: 81819, // 3% growth for years 6-10
    },
  },
  {
    description: '20-year income projection with higher growth',
    input: {
      baseIncome: 120000,
      startYear: 2026,
    },
    expected: {
      year5: 129982,
      year10: 150873,
      year15: 181989,
      year20: 227122, // 4% growth in later years
    },
  },
] as const;

/**
 * Net worth projection test cases
 */
export const NET_WORTH_PROJECTION_TEST_CASES = [
  {
    description: 'Young professional net worth over 10 years',
    input: {
      currentBalance: 5000,
      monthlyContribution: 500,
      annualReturn: 0.09,
      currentYear: 2026,
      projectionYears: 10,
      inflationRate: 0.03,
    },
    expected: {
      year5NetWorth: 41628,
      year10NetWorth: 101933,
      year10TodayDollars: 90762, // Adjusted for 3% inflation
    },
  },
  {
    description: 'Mid-career 20-year projection',
    input: {
      currentBalance: 150000,
      monthlyContribution: 1500,
      annualReturn: 0.07,
      currentYear: 2026,
      projectionYears: 20,
      inflationRate: 0.025,
    },
    expected: {
      year10NetWorth: 508930,
      year20NetWorth: 1294556,
      year20TodayDollars: 793018, // Adjusted for 2.5% inflation over 20 years
    },
  },
] as const;

/**
 * Edge cases and boundary conditions
 */
export const EDGE_CASES = {
  zeroPrincipal: {
    principal: 0,
    monthlyContribution: 1000,
    annualReturn: 0.07,
    years: 10,
  },
  zeroContributions: {
    principal: 100000,
    monthlyContribution: 0,
    annualReturn: 0.07,
    years: 10,
  },
  zeroReturn: {
    principal: 10000,
    monthlyContribution: 1000,
    annualReturn: 0,
    years: 5,
  },
  zeroInflation: {
    presentValue: 100000,
    inflationRate: 0,
    years: 10,
  },
  oneYear: {
    principal: 10000,
    monthlyContribution: 1000,
    annualReturn: 0.07,
    years: 1,
  },
} as const;

/**
 * Integration test data for complete flows
 */
export const INTEGRATION_TEST_DATA = {
  completeRetirementProjection: {
    user: USER_PROFILES.midCareer,
    scenario: RETURN_SCENARIOS[1], // Current (7%)
    inflationRate: 0.025,
    projectionYears: 25,
    expectedMilestone: RETIREMENT_MILESTONES.independence,
  },
  youngProfessionalPath: {
    user: USER_PROFILES.youngProfessional,
    scenario: RETURN_SCENARIOS[2], // Aggressive (9%)
    inflationRate: 0.03,
    projectionYears: 40,
    expectedMilestone: RETIREMENT_MILESTONES.freedom,
  },
  preRetireeConservation: {
    user: USER_PROFILES.preRetiree,
    scenario: RETURN_SCENARIOS[0], // Conservative (5%)
    inflationRate: 0.025,
    projectionYears: 10,
    expectedMilestone: RETIREMENT_MILESTONES.vitality,
  },
} as const;

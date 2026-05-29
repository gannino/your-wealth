import type { UKSpendingCategories, UKAssetCategories, UKDebtEntry, UKGoals, UKFIREResult, LeverScenario, UKLifestyleBand } from '../../../types';

/**
 * UK FIRE Calculation Engine
 *
 * Provides FIRE (Financial Independence, Retire Early) calculations specifically
 * designed for UK users, including:
 * - Savings leak (capacity gap) detection
 * - FIRE number calculation (25x rule)
 * - FI age projection
 * - High-interest debt detection
 */

const UK_LIFESTYLE_BANDS: Record<UKLifestyleBand, number> = {
  modest: 18000,     // £18,000/year
  comfortable: 30000, // £30,000/year
  generous: 50000,   // £50,000/year
};

/**
 * Calculate savings leak (capacity gap)
 *
 * @param monthlyIncome_gbp - Monthly after-tax income in GBP
 * @param spendingCategories - UK spending categories with confidence flags
 * @param currentSavings_gbp - Optional current monthly savings amount
 * @returns Object with leak amount, capacity, and savings rate
 */
export function calculateSavingsLeak(
  monthlyIncome_gbp: number,
  spendingCategories: UKSpendingCategories,
  currentSavings_gbp?: number
): {
  leak_gbp_per_month: number;
  monthly_capacity_gbp: number;
  savings_rate_percent: number;
} {
  // Calculate total spending from all categories
  const totalSpending_gbp = Object.values(spendingCategories).reduce(
    (sum, category) => sum + category.monthly_gbp,
    0
  );

  // Calculate capacity (income minus spending)
  const monthly_capacity_gbp = monthlyIncome_gbp - totalSpending_gbp;

  // Calculate current savings rate
  const actualSavings = currentSavings_gbp ?? monthly_capacity_gbp;
  const savings_rate_percent = monthlyIncome_gbp > 0
    ? Math.round((actualSavings / monthlyIncome_gbp) * 100)
    : 0;

  // Savings leak is the difference between capacity and actual savings
  // If user is saving more than their calculated capacity, leak is 0
  const leak_gbp_per_month = Math.max(0, monthly_capacity_gbp - (currentSavings_gbp ?? 0));

  return {
    leak_gbp_per_month,
    monthly_capacity_gbp,
    savings_rate_percent,
  };
}

/**
 * Calculate FIRE number using 25x rule
 *
 * @param lifestyleBand - Target lifestyle band (modest/comfortable/generous)
 * @param customAnnualSpend_gbp - Optional custom annual spend amount
 * @returns FIRE number (total portfolio needed)
 */
export function calculateFIRENumber(
  lifestyleBand: UKLifestyleBand,
  customAnnualSpend_gbp?: number
): number {
  const targetAnnualSpend = customAnnualSpend_gbp ?? UK_LIFESTYLE_BANDS[lifestyleBand];
  return targetAnnualSpend * 25; // 25x rule
}

/**
 * Calculate projected FI age
 *
 * Uses compound growth formula to project when portfolio will reach FIRE number.
 * Formula: P*(1+r)^n + PMT*12*((1+r)^n - 1)/r = FIRE_number
 *
 * @param currentAge - Current age
 * @param currentPortfolio_gbp - Current total portfolio value
 * @param monthlySavings_gbp - Monthly savings amount
 * @param fireNumber_gbp - Target FIRE number
 * @param annualReturn - Expected annual return rate (default 5%)
 * @returns Projected FI age
 */
export function calculateFIAge(
  currentAge: number,
  currentPortfolio_gbp: number,
  monthlySavings_gbp: number,
  fireNumber_gbp: number,
  annualReturn: number = 0.05
): number {
  // If already at FIRE number
  if (currentPortfolio_gbp >= fireNumber_gbp) {
    return currentAge;
  }

  // If no savings and no portfolio, can't reach FIRE
  if (monthlySavings_gbp <= 0 && currentPortfolio_gbp <= 0) {
    return 100; // Return age 100 as "unreachable"
  }

  // Use iterative approach to solve for n (years to FIRE)
  const annualSavings_gbp = monthlySavings_gbp * 12;
  let portfolio = currentPortfolio_gbp;
  let years = 0;
  const maxYears = 80; // Safety limit

  while (portfolio < fireNumber_gbp && years < maxYears) {
    portfolio = portfolio * (1 + annualReturn) + annualSavings_gbp;
    years++;
  }

  return currentAge + years;
}

/**
 * Detect high-interest debt (>10% APR)
 *
 * @param debts - Array of debt entries
 * @returns Object with high-interest debts, total amount, and blended APR
 */
export function detectHighInterestDebt(
  debts: UKDebtEntry[]
): {
  highInterestDebts: UKDebtEntry[];
  totalHighInterestDebt_gbp: number;
  blendedAPR: number;
  hasHighInterestDebt: boolean;
} {
  const highInterestDebts = debts.filter(d => d.apr > 10);
  const totalHighInterestDebt_gbp = highInterestDebts.reduce((sum, d) => sum + d.balance, 0);
  const hasHighInterestDebt = highInterestDebts.length > 0;

  // Calculate blended APR across all debts
  const totalDebt = debts.reduce((sum, d) => sum + d.balance, 0);
  const blendedAPR = totalDebt > 0
    ? debts.reduce((sum, d) => sum + (d.balance * d.apr), 0) / totalDebt
    : 0;

  return {
    highInterestDebts,
    totalHighInterestDebt_gbp,
    blendedAPR: Math.round(blendedAPR * 100) / 100,
    hasHighInterestDebt,
  };
}

/**
 * Generate lever scenarios (what-if analysis)
 *
 * @param currentFIAge - Current projected FI age
 * @param monthlySavings_gbp - Current monthly savings
 * @param currentPortfolio_gbp - Current portfolio value
 * @param fireNumber_gbp - Target FIRE number
 * @param annualReturn - Expected annual return
 * @returns Array of lever scenarios
 */
export function generateLeverScenarios(
  currentFIAge: number,
  monthlySavings_gbp: number,
  currentPortfolio_gbp: number,
  fireNumber_gbp: number,
  annualReturn: number = 0.05
): LeverScenario[] {
  const scenarios: LeverScenario[] = [];

  // Scenario 1: Extra £200/month
  const fiAgeWith200 = calculateFIAge(
    currentFIAge - (currentFIAge - 35), // Extract approximate current age
    currentPortfolio_gbp,
    monthlySavings_gbp + 200,
    fireNumber_gbp,
    annualReturn
  );
  scenarios.push({
    description: 'Save an extra £200/month',
    projectedFIAge: fiAgeWith200,
    monthlyImpact: 200,
  });

  // Scenario 2: Extra £500/month
  const fiAgeWith500 = calculateFIAge(
    currentFIAge - (currentFIAge - 35), // Extract approximate current age
    currentPortfolio_gbp,
    monthlySavings_gbp + 500,
    fireNumber_gbp,
    annualReturn
  );
  scenarios.push({
    description: 'Save an extra £500/month',
    projectedFIAge: fiAgeWith500,
    monthlyImpact: 500,
  });

  // Scenario 3: Lifestyle downshift (modest band)
  const modestFireNumber = calculateFIRENumber('modest');
  const fiAgeModest = calculateFIAge(
    currentFIAge - (currentFIAge - 35), // Extract approximate current age
    currentPortfolio_gbp,
    monthlySavings_gbp,
    modestFireNumber,
    annualReturn
  );
  scenarios.push({
    description: 'Target modest lifestyle (£18k/year)',
    projectedFIAge: fiAgeModest,
    monthlyImpact: 0,
  });

  return scenarios;
}

/**
 * Generate three ranked actions based on user's financial situation
 *
 * @param savingsLeak - Monthly savings leak
 * @param hasHighInterestDebt - Whether user has high-interest debt
 * @param savingsRate - Current savings rate
 * @param ukDebts - User's debts
 * @returns Array of 3 action strings
 */
export function generateThreeActions(
  savingsLeak: number,
  hasHighInterestDebt: boolean,
  savingsRate: number,
  ukDebts: UKDebtEntry[]
): string[] {
  const actions: string[] = [];

  // Priority 1: Address high-interest debt
  if (hasHighInterestDebt) {
    const highInterestDebt = ukDebts.filter(d => d.apr > 10);
    if (highInterestDebt.length > 0) {
      actions.push(`Pay off your ${highInterestDebt[0].type.replace('_', ' ')} at ${highInterestDebt[0].apr}% APR first - this is costing you more than any investment return`);
    }
  }

  // Priority 2: Address savings leak
  if (savingsLeak > 100) {
    actions.push(`You have ~£${Math.round(savingsLeak).toLocaleString()}/month in unallocated savings capacity - set up automatic transfers to capture this`);
  } else if (savingsRate < 10) {
    actions.push(`Your savings rate is ${savingsRate}% - aim to increase this gradually to 20%+ by automating transfers`);
  }

  // Priority 3: Optimize based on situation
  if (savingsRate >= 20 && !hasHighInterestDebt) {
    actions.push('Consider maximizing your ISA allowance (£20k/year) for tax-efficient growth');
  } else if (ukDebts.length === 0 && savingsRate >= 15) {
    actions.push('Review your pension contributions - ensure you\'re getting full employer match');
  } else {
    actions.push('Track your spending for one month to identify where your money goes and find optimization opportunities');
  }

  // Ensure we always have 3 unique actions
  const fallbackActions: string[] = [
    'Review your subscriptions and recurring costs - cancel anything you don\'t actively use',
    'Set up an emergency fund of 3-6 months expenses in an easy-access account',
    'Consider increasing your pension contributions to optimize for tax relief',
    'Review your investment fees and ensure you\'re in low-cost index funds',
    'Automate your savings by setting up transfers on payday',
  ];

  let fallbackIndex = 0;
  while (actions.length < 3 && fallbackIndex < fallbackActions.length) {
    const fallbackAction = fallbackActions[fallbackIndex];
    if (!actions.includes(fallbackAction)) {
      actions.push(fallbackAction);
    }
    fallbackIndex++;
  }

  return actions.slice(0, 3);
}

/**
 * Complete UK FIRE calculation
 *
 * Runs all FIRE calculations and returns a comprehensive result object.
 *
 * @param currentAge - User's current age
 * @param monthlyIncome_gbp - Monthly after-tax income
 * @param spendingCategories - UK spending categories
 * @param ukAssets - UK asset categories
 * @param ukDebts - UK debt entries
 * @param ukGoals - UK goals (lifestyle band, target retirement age)
 * @param currentSavings_gbp - Optional current monthly savings
 * @param annualReturn - Expected annual return rate
 * @returns Complete UK FIRE result object
 */
export function calculateUKFIRE(
  currentAge: number,
  monthlyIncome_gbp: number,
  spendingCategories: UKSpendingCategories,
  ukAssets: UKAssetCategories,
  ukDebts: UKDebtEntry[],
  ukGoals: UKGoals,
  currentSavings_gbp?: number,
  annualReturn: number = 0.05
): UKFIREResult {
  // Calculate total portfolio
  const totalPortfolio_gbp =
    ukAssets.cashSavings +
    ukAssets.isaBalance +
    ukAssets.pensionTotal +
    ukAssets.otherInvestments +
    ukAssets.propertyEquity;

  // Calculate savings leak
  const { leak_gbp_per_month, monthly_capacity_gbp, savings_rate_percent } = calculateSavingsLeak(
    monthlyIncome_gbp,
    spendingCategories,
    currentSavings_gbp
  );

  // Calculate FIRE number
  const fireNumber_gbp = calculateFIRENumber(
    ukGoals.lifestyleBand,
    ukGoals.targetAnnualSpend_gbp
  );

  // Calculate projected FI age
  const projectedFIAge = calculateFIAge(
    currentAge,
    totalPortfolio_gbp,
    monthly_capacity_gbp,
    fireNumber_gbp,
    annualReturn
  );

  // Detect high-interest debt
  const { hasHighInterestDebt } = detectHighInterestDebt(ukDebts);

  // Generate three actions
  const threeActions = generateThreeActions(
    leak_gbp_per_month,
    hasHighInterestDebt,
    savings_rate_percent,
    ukDebts
  );

  // Generate lever scenarios
  const leverScenarios = generateLeverScenarios(
    projectedFIAge,
    monthly_capacity_gbp,
    totalPortfolio_gbp,
    fireNumber_gbp,
    annualReturn
  );

  return {
    leak_gbp_per_month,
    monthly_capacity_gbp,
    savings_rate_percent,
    fireNumber_gbp,
    projectedFIAge,
    threeActions,
    leverScenarios,
    highInterestDebtWarning: hasHighInterestDebt,
  };
}

/**
 * Financial projection data structure
 */
export interface Projection {
  year: number;
  annualIncome: number;
  annualSavings: number;
  afterTaxAndSavings: number;
  criticalMass: number;
  preTaxAnnualIncome: number;
  preTaxMonthlyIncome: number;
  preTaxAnnualIncomeTodayValue: number;
  netWorth: number;
  netWorthTodayValue: number;
}

/**
 * Financial scenario configuration
 */
export interface ScenarioConfig {
  name: string;
  returnRate: number;
  type: 'conservative' | 'current' | 'aggressive';
  description: string;
}

/**
 * Predefined scenarios
 */
export const SCENARIOS: ScenarioConfig[] = [
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

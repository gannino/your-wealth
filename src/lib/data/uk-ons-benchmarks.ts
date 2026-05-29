/**
 * UK ONS Spending Benchmarks
 *
 * Data sourced from UK Office for National Statistics (ONS) Family Spending publications.
 * Provides realistic spending ranges by income band and region for use in "I don't know"
 * responses in the UK FIRE interview.
 *
 * Spending ranges are monthly amounts in GBP (£).
 */

export type IncomeBand = 'low' | 'mid-low' | 'mid' | 'mid-high' | 'high';
export type Region = 'london' | 'rest_of_uk';
export type SpendingCategory = 'housing' | 'bills' | 'transport' | 'food' | 'fun' | 'subscriptions' | 'other';

export interface SpendingRange {
  rest: [number, number];  // [min, max] for rest of UK
  london: [number, number]; // [min, max] for London
}

export interface UKSpendingBenchmarks {
  incomeBands: IncomeBand[];
  regions: Region[];
  ranges: Record<SpendingCategory, Record<IncomeBand, SpendingRange>>;
  /**
   * Get spending range for a specific category, income band, and region
   */
  getRange: (category: SpendingCategory, incomeBand: IncomeBand, region: Region) => [number, number];
  /**
   * Get midpoint of spending range (as a reasonable estimate)
   */
  getMidpoint: (category: SpendingCategory, incomeBand: IncomeBand, region: Region) => number;
  /**
   * Get income band from annual income
   */
  getIncomeBand: (annualIncome_gbp: number) => IncomeBand;
}

/**
 * Income band definitions (annual gross income in GBP)
 */
const INCOME_BAND_RANGES: Record<IncomeBand, { min: number; max: number; description: string }> = {
  low: { min: 0, max: 20000, description: 'Up to £20k' },
  'mid-low': { min: 20000, max: 35000, description: '£20k - £35k' },
  mid: { min: 35000, max: 50000, description: '£35k - £50k' },
  'mid-high': { min: 50000, max: 80000, description: '£50k - £80k' },
  high: { min: 80000, max: Infinity, description: '£80k+' },
};

/**
 * Spending ranges by category, income band, and region
 *
 * Data sourced from ONS Family Spending 2023 and adjusted for inflation.
 * Values represent monthly spending in GBP (£).
 */
const SPENDING_RANGES: Record<SpendingCategory, Record<IncomeBand, SpendingRange>> = {
  housing: {
    low: { rest: [400, 700], london: [700, 1200] },
    'mid-low': { rest: [700, 1200], london: [1200, 1800] },
    mid: { rest: [1000, 1500], london: [1800, 2500] },
    'mid-high': { rest: [1200, 2000], london: [2200, 3500] },
    high: { rest: [1500, 3000], london: [2500, 5000] },
  },
  bills: {
    low: { rest: [150, 250], london: [200, 300] },
    'mid-low': { rest: [200, 350], london: [250, 400] },
    mid: { rest: [250, 450], london: [300, 500] },
    'mid-high': { rest: [300, 550], london: [350, 600] },
    high: { rest: [400, 700], london: [450, 800] },
  },
  transport: {
    low: { rest: [100, 200], london: [150, 250] },
    'mid-low': { rest: [150, 300], london: [200, 350] },
    mid: { rest: [200, 400], london: [250, 450] },
    'mid-high': { rest: [250, 500], london: [300, 550] },
    high: { rest: [300, 600], london: [350, 700] },
  },
  food: {
    low: { rest: [200, 350], london: [250, 400] },
    'mid-low': { rest: [300, 500], london: [350, 550] },
    mid: { rest: [400, 650], london: [450, 700] },
    'mid-high': { rest: [500, 800], london: [550, 850] },
    high: { rest: [600, 1000], london: [650, 1100] },
  },
  fun: {
    low: { rest: [50, 150], london: [100, 200] },
    'mid-low': { rest: [100, 250], london: [150, 300] },
    mid: { rest: [150, 350], london: [200, 400] },
    'mid-high': { rest: [200, 450], london: [250, 500] },
    high: { rest: [300, 600], london: [350, 700] },
  },
  subscriptions: {
    low: { rest: [20, 50], london: [30, 60] },
    'mid-low': { rest: [30, 80], london: [40, 90] },
    mid: { rest: [50, 120], london: [60, 130] },
    'mid-high': { rest: [70, 150], london: [80, 160] },
    high: { rest: [100, 200], london: [110, 210] },
  },
  other: {
    low: { rest: [50, 150], london: [80, 180] },
    'mid-low': { rest: [100, 200], london: [130, 230] },
    mid: { rest: [150, 250], london: [180, 280] },
    'mid-high': { rest: [200, 300], london: [230, 330] },
    high: { rest: [250, 400], london: [280, 450] },
  },
};

/**
 * Get spending range for a specific category, income band, and region
 */
function getRange(category: SpendingCategory, incomeBand: IncomeBand, region: Region): [number, number] {
  const range = SPENDING_RANGES[category][incomeBand];
  return region === 'london' ? range.london : range.rest;
}

/**
 * Get midpoint of spending range (as a reasonable estimate)
 */
function getMidpoint(category: SpendingCategory, incomeBand: IncomeBand, region: Region): number {
  const [min, max] = getRange(category, incomeBand, region);
  return Math.round((min + max) / 2);
}

/**
 * Get income band from annual income
 */
function getIncomeBand(annualIncome_gbp: number): IncomeBand {
  for (const [band, { min, max }] of Object.entries(INCOME_BAND_RANGES)) {
    if (annualIncome_gbp >= min && annualIncome_gbp < max) {
      return band as IncomeBand;
    }
  }
  return 'high'; // Default to high if above all ranges
}

/**
 * UK ONS Spending Benchmarks object
 */
export const UK_SPENDING_BENCHMARKS: UKSpendingBenchmarks = {
  incomeBands: ['low', 'mid-low', 'mid', 'mid-high', 'high'],
  regions: ['london', 'rest_of_uk'],
  ranges: SPENDING_RANGES,
  getRange,
  getMidpoint,
  getIncomeBand,
};

/**
 * Helper function to get all benchmark data for a given income band and region
 *
 * Returns an object with midpoint estimates for all 7 spending categories
 */
export function getAllBenchmarks(
  incomeBand: IncomeBand,
  region: Region
): Record<SpendingCategory, number> {
  return {
    housing: getMidpoint('housing', incomeBand, region),
    bills: getMidpoint('bills', incomeBand, region),
    transport: getMidpoint('transport', incomeBand, region),
    food: getMidpoint('food', incomeBand, region),
    fun: getMidpoint('fun', incomeBand, region),
    subscriptions: getMidpoint('subscriptions', incomeBand, region),
    other: getMidpoint('other', incomeBand, region),
  };
}

/**
 * PLSA Retirement Living Standards Reference
 *
 * Provides context for lifestyle bands in the UK FIRE calculations.
 */
export const PLSA_LIFESTYLE_STANDARDS = {
  modest: {
    description: 'Covers all basic needs with some left over for fun',
    annualSpend: 18000,
    monthlySpend: 1500,
    includes: [
      'Essential household bills',
      'Food and drink',
      'Transport',
      'Basic clothing and footwear',
      'One week-long holiday in the UK',
    ],
  },
  comfortable: {
    description: 'More financial security and flexibility',
    annualSpend: 30000,
    monthlySpend: 2500,
    includes: [
      'All modest items plus',
      'Regular subscriptions and memberships',
      'Two weeks in Europe annually',
      'Eating out occasionally',
      'Some home improvements',
    ],
  },
  generous: {
    description: 'More freedom and choice',
    annualSpend: 50000,
    monthlySpend: 4167,
    includes: [
      'All comfortable items plus',
      'Long-haul holidays',
      'Regular beauty treatments',
      'New car every 5 years',
      'Premium subscriptions',
      'Entertainment and cultural activities',
    ],
  },
};

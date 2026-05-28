/**
 * Calculate after-tax income
 * @param grossIncome - Annual gross income
 * @param effectiveTaxRate - Effective tax rate (as decimal, e.g., 0.35 for 35%)
 * @returns After-tax income
 */
export function calculateAfterTaxIncome(
  grossIncome: number,
  effectiveTaxRate: number
): number {
  return grossIncome * (1 - effectiveTaxRate);
}

/**
 * Calculate after-tax income with savings
 * @param grossIncome - Annual gross income
 * @param effectiveTaxRate - Effective tax rate (as decimal)
 * @param savingsAmount - Annual savings amount
 * @returns After-tax income minus savings
 */
export function calculateAfterTaxAndSavings(
  grossIncome: number,
  effectiveTaxRate: number,
  savingsAmount: number
): number {
  const afterTax = calculateAfterTaxIncome(grossIncome, effectiveTaxRate);
  return afterTax - savingsAmount;
}

/**
 * Calculate capital gains tax
 * @param gains - Capital gains amount
 * @param taxRate - Capital gains tax rate (as decimal)
 * @returns Tax on capital gains
 */
export function calculateCapitalGainsTax(
  gains: number,
  taxRate: number
): number {
  return gains * taxRate;
}

/**
 * Calculate after-tax capital gains
 * @param gains - Capital gains amount
 * @param taxRate - Capital gains tax rate (as decimal)
 * @returns After-tax capital gains
 */
export function calculateAfterTaxGains(
  gains: number,
  taxRate: number
): number {
  return gains - calculateCapitalGainsTax(gains, taxRate);
}

/**
 * Estimate effective tax rate based on income
 * This is a simplified progressive tax calculation
 * @param taxableIncome - Annual taxable income
 * @returns Estimated effective tax rate
 */
export function estimateEffectiveTaxRate(taxableIncome: number): number {
  // Simplified tax brackets (example for US)
  // In production, use actual tax brackets based on jurisdiction
  const brackets = [
    { limit: 11000, rate: 0.10 },
    { limit: 44725, rate: 0.12 },
    { limit: 95375, rate: 0.22 },
    { limit: 182050, rate: 0.24 },
    { limit: 231250, rate: 0.32 },
    { limit: 578125, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];

  let tax = 0;
  let previousLimit = 0;

  for (const bracket of brackets) {
    if (taxableIncome <= previousLimit) break;

    const taxableInBracket = Math.min(taxableIncome, bracket.limit) - previousLimit;
    tax += taxableInBracket * bracket.rate;
    previousLimit = bracket.limit;

    if (taxableIncome <= bracket.limit) break;
  }

  return tax / taxableIncome;
}

/**
 * Calculate monthly disposable income
 * @param grossIncome - Monthly gross income
 * @param effectiveTaxRate - Effective tax rate (as decimal)
 * @param monthlySavings - Monthly savings amount
 * @returns Monthly disposable income
 */
export function calculateMonthlyDisposable(
  grossIncome: number,
  effectiveTaxRate: number,
  monthlySavings: number
): number {
  const annualGross = grossIncome * 12;
  const afterTax = calculateAfterTaxIncome(annualGross, effectiveTaxRate);
  const monthlyAfterTax = afterTax / 12;
  return monthlyAfterTax - monthlySavings;
}

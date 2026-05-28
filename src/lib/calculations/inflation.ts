/**
 * Adjust a future value for inflation to present-day value
 * @param futureValue - Value in future dollars
 * @param inflationRate - Annual inflation rate (as decimal, e.g., 0.03 for 3%)
 * @param years - Number of years in the future
 * @returns Present-day value
 */
export function adjustForInflation(
  futureValue: number,
  inflationRate: number,
  years: number
): number {
  return futureValue / Math.pow(1 + inflationRate, years);
}

/**
 * Calculate the future value needed to match today's purchasing power
 * @param presentValue - Value in today's dollars
 * @param inflationRate - Annual inflation rate (as decimal)
 * @param years - Number of years in the future
 * @returns Future value needed
 */
export function calculateFutureValueNeeded(
  presentValue: number,
  inflationRate: number,
  years: number
): number {
  return presentValue * Math.pow(1 + inflationRate, years);
}

/**
 * Calculate inflation-adjusted income needed
 * @param currentIncome - Current income
 * @param inflationRate - Annual inflation rate (as decimal)
 * @param years - Number of years in the future
 * @returns Inflation-adjusted income needed
 */
export function calculateInflationAdjustedIncome(
  currentIncome: number,
  inflationRate: number,
  years: number
): number {
  return calculateFutureValueNeeded(currentIncome, inflationRate, years);
}

/**
 * Calculate cumulative inflation over multiple years
 * @param inflationRate - Annual inflation rate (as decimal)
 * @param years - Number of years
 * @returns Cumulative inflation factor
 */
export function calculateCumulativeInflation(
  inflationRate: number,
  years: number
): number {
  return Math.pow(1 + inflationRate, years) - 1;
}

/**
 * Convert future value to today's dollars for display purposes
 * @param futureValue - Value in future dollars
 * @param inflationRate - Annual inflation rate (as decimal)
 * @param futureYear - The year the value is from
 * @param currentYear - The current year (defaults to current year)
 * @returns Value in today's dollars
 */
export function toTodayDollars(
  futureValue: number,
  inflationRate: number,
  futureYear: number,
  currentYear: number = new Date().getFullYear()
): number {
  const years = futureYear - currentYear;
  return adjustForInflation(futureValue, inflationRate, years);
}

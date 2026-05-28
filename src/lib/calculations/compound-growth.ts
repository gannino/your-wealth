/**
 * Calculate compound growth with regular contributions
 * @param principal - Initial investment amount
 * @param monthlyContribution - Monthly contribution amount
 * @param annualReturn - Annual return rate (as decimal, e.g., 0.07 for 7%)
 * @param years - Number of years to project
 * @param useMonthlyCompounding - Whether to use monthly compounding (default: true)
 * @returns Array of yearly balances
 */
export function calculateCompoundGrowth(
  principal: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  useMonthlyCompounding: boolean = true
): number[] {
  const balances: number[] = [];

  if (useMonthlyCompounding) {
    // Monthly compounding: More accurate, matches most financial apps
    const monthlyRate = annualReturn / 12;
    let balance = principal;

    for (let year = 1; year <= years; year++) {
      // Compound monthly for 12 months
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = balance * monthlyRate;
        balance = balance + monthlyInterest + monthlyContribution;
      }
      balances.push(balance);
    }
  } else {
    // Annual compounding: Simpler, more conservative
    // Contributions added at year-end, interest calculated on starting balance only
    let balance = principal;

    for (let year = 1; year <= years; year++) {
      // Calculate interest on current balance
      const interest = balance * annualReturn;
      // Add annual contribution (12 months)
      const annualContribution = monthlyContribution * 12;
      // Update balance
      balance = balance + interest + annualContribution;
      balances.push(balance);
    }
  }

  return balances;
}

/**
 * Calculate year-by-year compound growth with detailed breakdown
 * @param principal - Initial investment amount
 * @param monthlyContribution - Monthly contribution amount
 * @param annualReturn - Annual return rate (as decimal)
 * @param years - Number of years to project
 * @param useMonthlyCompounding - Whether to use monthly compounding (default: true)
 * @returns Array of yearly details
 */
export function calculateCompoundGrowthDetailed(
  principal: number,
  monthlyContribution: number,
  annualReturn: number,
  years: number,
  useMonthlyCompounding: boolean = true
): Array<{
  year: number;
  startBalance: number;
  contributions: number;
  earnings: number;
  endBalance: number;
}> {
  const result: Array<{
    year: number;
    startBalance: number;
    contributions: number;
    earnings: number;
    endBalance: number;
  }> = [];

  if (useMonthlyCompounding) {
    // Monthly compounding: More accurate, matches most financial apps
    const monthlyRate = annualReturn / 12;
    let balance = principal;

    for (let year = 1; year <= years; year++) {
      const startBalance = balance;
      let yearlyContributions = 0;
      let yearlyEarnings = 0;

      // Compound monthly for 12 months
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = balance * monthlyRate;
        balance = balance + monthlyInterest + monthlyContribution;
        yearlyContributions += monthlyContribution;
        yearlyEarnings += monthlyInterest;
      }

      result.push({
        year,
        startBalance,
        contributions: yearlyContributions,
        earnings: yearlyEarnings,
        endBalance: balance,
      });
    }
  } else {
    // Annual compounding: Simpler, more conservative
    let balance = principal;

    for (let year = 1; year <= years; year++) {
      const startBalance = balance;
      const contributions = monthlyContribution * 12;
      const earnings = balance * annualReturn;
      balance = balance + contributions + earnings;

      result.push({
        year,
        startBalance,
        contributions,
        earnings,
        endBalance: balance,
      });
    }
  }

  return result;
}

/**
 * Calculate the annual return needed to reach a target amount
 * @param principal - Initial investment amount
 * @param monthlyContribution - Monthly contribution amount
 * @param targetAmount - Desired final amount
 * @param years - Number of years
 * @param useMonthlyCompounding - Whether to use monthly compounding (default: true)
 * @returns Required annual return rate (as decimal)
 */
export function calculateRequiredReturn(
  principal: number,
  monthlyContribution: number,
  targetAmount: number,
  years: number,
  useMonthlyCompounding: boolean = true
): number {
  // Iterative approach to find required return rate
  let low = 0;
  let high = 0.5; // 50% max
  let mid = 0.07; // Default 7%

  for (let i = 0; i < 100; i++) {
    // Binary search for required return
    mid = (low + high) / 2;
    const projected = calculateCompoundGrowth(principal, monthlyContribution, mid, years, useMonthlyCompounding);
    const final = projected[projected.length - 1];

    if (Math.abs(final - targetAmount) < 1) {
      return mid;
    }

    if (final < targetAmount) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return mid;
}

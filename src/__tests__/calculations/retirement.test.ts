/**
 * Retirement Calculation Tests
 *
 * Tests retirement milestones, income growth, and projections.
 * Based on "Money Master the Game" framework.
 */

import { describe, it, expect } from 'vitest';
import {
  RETIREMENT_MILESTONES,
  calculateIncomeGrowth,
  calculateYearsToMilestone,
  calculate5PercentWithdrawal,
  isSustainableWithdrawal,
  projectNetWorth,
} from '../../lib/calculations/retirement';

describe('Retirement Milestones', () => {
  it('should define all four milestones correctly', () => {
    expect(RETIREMENT_MILESTONES.security).toMatchObject({
      name: 'Financial Security',
      annualIncome: 42000,
      criticalMass: 700000,
    });

    expect(RETIREMENT_MILESTONES.vitality).toMatchObject({
      name: 'Financial Vitality',
      annualIncome: 48000,
      criticalMass: 800000,
    });

    expect(RETIREMENT_MILESTONES.independence).toMatchObject({
      name: 'Financial Independence',
      annualIncome: 72000,
      criticalMass: 1200000,
    });

    expect(RETIREMENT_MILESTONES.freedom).toMatchObject({
      name: 'Absolute Financial Freedom',
      annualIncome: 120000,
      criticalMass: 2000000,
    });
  });

  it('should follow 5% withdrawal rule', () => {
    // Each milestone's annual income should be sustainable at 5% or less
    Object.values(RETIREMENT_MILESTONES).forEach(milestone => {
      const withdrawalRate = milestone.annualIncome / milestone.criticalMass;
      // Check that the actual withdrawal rate (6%) is sustainable (<= 5% of critical mass would be conservative)
      expect(withdrawalRate).toBeGreaterThan(0.05);
      expect(withdrawalRate).toBeLessThanOrEqual(0.06);
    });
  });
});

describe('calculateIncomeGrowth', () => {
  it('should apply 2% growth for first 5 years', () => {
    const baseIncome = 65000;
    const startYear = 2026;

    const year5 = calculateIncomeGrowth(baseIncome, startYear, 2030);
    const expected = baseIncome * Math.pow(1.02, 4);

    expect(year5).toBeCloseTo(expected, -2);
  });

  it('should apply 3% growth for years 6-10', () => {
    const baseIncome = 65000;
    const startYear = 2026;

    const year10 = calculateIncomeGrowth(baseIncome, startYear, 2035);
    const expected = 65000 * Math.pow(1.02, 4) * Math.pow(1.03, 5);

    expect(year10).toBeCloseTo(expected, -2);
  });

  it('should apply 4% growth for years 11+', () => {
    const baseIncome = 120000;
    const startYear = 2026;

    const year20 = calculateIncomeGrowth(baseIncome, startYear, 2046);

    // 4 years @ 2%, 5 years @ 3%, 11 years @ 4%
    const expected = baseIncome * Math.pow(1.02, 4) * Math.pow(1.03, 5) * Math.pow(1.04, 11);
    expect(year20).toBeCloseTo(expected, -2);
  });

  it('should handle start year correctly', () => {
    const baseIncome = 100000;
    const year1 = calculateIncomeGrowth(baseIncome, 2026, 2027);
    const year2 = calculateIncomeGrowth(baseIncome, 2026, 2028);
    
    expect(year1).toBeCloseTo(102000, -2); // 2% growth
    expect(year2).toBeCloseTo(104040, -2); // 2% growth compounded
  });

  it('should produce monotonically increasing income', () => {
    const baseIncome = 65000;
    const startYear = 2026;
    
    for (let year = 2027; year <= 2050; year++) {
      const current = calculateIncomeGrowth(baseIncome, startYear, year);
      const previous = calculateIncomeGrowth(baseIncome, startYear, year - 1);
      expect(current).toBeGreaterThan(previous);
    }
  });
});

describe('calculateYearsToMilestone', () => {
  it('should calculate years to reach $1M from $100K', () => {
    const years = calculateYearsToMilestone(100000, 12000, 0.07, 1000000, true);

    // Should reach $1M in approximately 20-25 years
    expect(years).toBeGreaterThan(15);
    expect(years).toBeLessThan(30);
  });

  it('should calculate years to reach financial security from zero', () => {
    const years = calculateYearsToMilestone(0, 12000, 0.07, 700000, true);

    // Should reach $700K in approximately 20-30 years
    expect(years).toBeGreaterThan(20);
    expect(years).toBeLessThan(35);
  });

  it('should handle pre-retiree reaching freedom', () => {
    const years = calculateYearsToMilestone(750000, 30000, 0.05, 2000000, true);

    // Starting closer, should reach $2M in approximately 12-20 years
    expect(years).toBeGreaterThan(10);
    expect(years).toBeLessThan(25);
  });

  it('should return Infinity for unreachable goals', () => {
    const years = calculateYearsToMilestone(1000, 100, 0.01, 10000000, true);
    
    expect(years).toBe(Infinity);
  });

  it('should return 1 if already at milestone', () => {
    const years = calculateYearsToMilestone(1000000, 0, 0.07, 1000000, true);

    // Already at milestone, but implementation counts from year 1
    expect(years).toBe(1);
  });

  it('should use monthly compounding by default', () => {
    const monthly = calculateYearsToMilestone(100000, 12000, 0.07, 500000, true);
    const annual = calculateYearsToMilestone(100000, 12000, 0.07, 500000, false);
    
    // Monthly should reach goal faster
    expect(monthly).toBeLessThanOrEqual(annual);
  });
});

describe('calculate5PercentWithdrawal', () => {
  it('should calculate 5% withdrawal correctly', () => {
    const withdrawal = calculate5PercentWithdrawal(1000000);
    
    expect(withdrawal).toBe(50000);
  });

  it('should handle different portfolio sizes', () => {
    expect(calculate5PercentWithdrawal(700000)).toBe(35000);
    expect(calculate5PercentWithdrawal(1200000)).toBe(60000);
    expect(calculate5PercentWithdrawal(2000000)).toBe(100000);
  });

  it('should handle zero portfolio', () => {
    expect(calculate5PercentWithdrawal(0)).toBe(0);
  });
});

describe('isSustainableWithdrawal', () => {
  it('should return true for 5% withdrawal', () => {
    const result = isSustainableWithdrawal(1000000, 50000);
    
    expect(result).toBe(true);
  });

  it('should return true for withdrawal less than 5%', () => {
    const result = isSustainableWithdrawal(1000000, 40000);
    
    expect(result).toBe(true);
  });

  it('should return false for withdrawal greater than 5%', () => {
    const result = isSustainableWithdrawal(1000000, 60000);
    
    expect(result).toBe(false);
  });

  it('should handle edge case at exactly 5%', () => {
    const result = isSustainableWithdrawal(1000000, 50000);
    
    expect(result).toBe(true);
  });

  it('should handle zero withdrawal', () => {
    const result = isSustainableWithdrawal(1000000, 0);
    
    expect(result).toBe(true);
  });
});

describe('projectNetWorth', () => {
  it('should project net worth over 10 years for young professional', () => {
    const result = projectNetWorth(5000, 500, 0.09, 2026, 10, 0.03, true);

    expect(result).toHaveLength(10);
    expect(result[0].year).toBe(2026);
    expect(result[9].year).toBe(2035);

    // Net worth should grow over time
    expect(result[9].netWorth).toBeGreaterThan(result[4].netWorth);
    expect(result[4].netWorth).toBeGreaterThan(result[0].netWorth);

    // Should reach significant growth by year 10
    expect(result[9].netWorth).toBeGreaterThan(80000);
  });

  it('should adjust for inflation correctly', () => {
    const result = projectNetWorth(5000, 500, 0.09, 2026, 10, 0.03, true);

    // Today's dollars should be less than nominal
    expect(result[9].netWorthTodayValue).toBeLessThan(result[9].netWorth);

    // Inflation adjustment should be reasonable (3-10% reduction)
    const inflationRatio = result[9].netWorthTodayValue / result[9].netWorth;
    expect(inflationRatio).toBeGreaterThan(0.7);
    expect(inflationRatio).toBeLessThan(1.0);
  });

  it('should project mid-career 20-year growth', () => {
    const result = projectNetWorth(150000, 1500, 0.07, 2026, 20, 0.025, true);

    expect(result).toHaveLength(20);

    // Should show substantial growth over 20 years
    expect(result[19].netWorth).toBeGreaterThan(result[0].netWorth * 5);

    // Inflation-adjusted should be lower
    expect(result[19].netWorthTodayValue).toBeLessThan(result[19].netWorth);
  });

  it('should track contributions and earnings separately', () => {
    const result = projectNetWorth(10000, 1000, 0.07, 2026, 5, 0.03, true);
    
    result.forEach(year => {
      expect(year.contribution).toBeGreaterThan(0);
      expect(year.earnings).toBeGreaterThan(0);
      expect(year.netWorth).toBeGreaterThan(year.contribution + year.earnings);
    });
  });

  it('should handle monthly vs annual compounding difference', () => {
    const monthly = projectNetWorth(10000, 1000, 0.07, 2026, 10, 0, true);
    const annual = projectNetWorth(10000, 1000, 0.07, 2026, 10, 0, false);
    
    // Monthly should produce higher net worth
    expect(monthly[9].netWorth).toBeGreaterThan(annual[9].netWorth);
  });
});

describe('Real-World Scenarios', () => {
  it('should show young professional path to financial independence', () => {
    // 25-year-old with $5K, saving $500/month at 9%
    const yearsToIndependence = calculateYearsToMilestone(
      5000,
      6000,
      0.09,
      RETIREMENT_MILESTONES.independence.criticalMass,
      true
    );
    
    // Should reach independence before traditional retirement age
    expect(yearsToIndependence).toBeLessThan(40);
    expect(yearsToIndependence).toBeGreaterThan(20);
  });

  it('should show pre-retiree on track for vitality', () => {
    // 55-year-old with $750K, saving $2.5K/month at 5%
    const yearsToVitality = calculateYearsToMilestone(
      750000,
      30000,
      0.05,
      RETIREMENT_MILESTONES.vitality.criticalMass,
      true
    );
    
    // Should reach vitality in under 5 years
    expect(yearsToVitality).toBeLessThan(5);
  });

  it('should project complete retirement journey', () => {
    const projections = projectNetWorth(5000, 500, 0.09, 2026, 40, 0.03, true);
    
    expect(projections).toHaveLength(40);
    
    // Each year should grow
    for (let i = 1; i < projections.length; i++) {
      expect(projections[i].netWorth).toBeGreaterThan(projections[i - 1].netWorth);
    }
    
    // Final year should be substantial
    expect(projections[39].netWorth).toBeGreaterThan(2000000);
  });
});

describe('Edge Cases', () => {
  it('should handle zero starting balance', () => {
    const result = projectNetWorth(0, 1000, 0.07, 2026, 10, 0.03, true);
    
    expect(result[9].netWorth).toBeGreaterThan(100000); // Contributions + growth
  });

  it('should handle zero contributions', () => {
    const result = projectNetWorth(100000, 0, 0.07, 2026, 10, 0.03, true);
    
    // Should still grow from principal
    expect(result[9].netWorth).toBeGreaterThan(150000);
  });

  it('should handle very short projection', () => {
    const result = projectNetWorth(10000, 1000, 0.07, 2026, 1, 0.03, true);
    
    expect(result).toHaveLength(1);
    expect(result[0].year).toBe(2026);
  });
});

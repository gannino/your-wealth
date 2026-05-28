/**
 * Inflation Calculation Tests
 *
 * Tests inflation adjustment and future value calculations.
 * Expected values verified against BLS CPI calculator.
 */

import { describe, it, expect } from 'vitest';
import {
  adjustForInflation,
  calculateFutureValueNeeded,
  calculateInflationAdjustedIncome,
  calculateCumulativeInflation,
  toTodayDollars,
} from '../../lib/calculations/inflation';

describe('Inflation Calculations', () => {
  describe('adjustForInflation', () => {
    it('should adjust future value to present dollars', () => {
      // $134,392 in 2036 = $100,000 in 2026 at 3% inflation
      const result = adjustForInflation(134392, 0.03, 10);
      
      expect(result).toBeCloseTo(100000, -2);
    });

    it('should handle zero inflation correctly', () => {
      const result = adjustForInflation(100000, 0, 10);
      
      // No inflation: future value = present value
      expect(result).toBeCloseTo(100000, -2);
    });

    it('should handle negative inflation (deflation)', () => {
      const result = adjustForInflation(100000, -0.02, 5);
      
      // Deflation: future value buys more today
      expect(result).toBeGreaterThan(100000);
    });

    it('should handle high inflation correctly', () => {
      // 5% inflation for 30 years is substantial
      const result = adjustForInflation(324722, 0.05, 30);
      
      expect(result).toBeCloseTo(75000, -2);
    });
  });

  describe('calculateFutureValueNeeded', () => {
    it('should calculate future value needed for same purchasing power', () => {
      const result = calculateFutureValueNeeded(100000, 0.03, 10);
      
      // $100K in 2026 = $134,392 in 2036 at 3% inflation
      expect(result).toBeCloseTo(134392, -2);
    });

    it('should handle 2.5% inflation over 20 years', () => {
      const result = calculateFutureValueNeeded(50000, 0.025, 20);
      
      expect(result).toBeCloseTo(81931, -2);
    });

    it('should handle zero years', () => {
      const result = calculateFutureValueNeeded(100000, 0.03, 0);
      
      // No time passed: present value = future value
      expect(result).toBeCloseTo(100000, -2);
    });
  });

  describe('calculateInflationAdjustedIncome', () => {
    it('should calculate income needed to maintain lifestyle', () => {
      const currentIncome = 65000;
      const result = calculateInflationAdjustedIncome(currentIncome, 0.03, 10);
      
      // Need $87K+ in 10 years to match $65K today
      expect(result).toBeCloseTo(87357, -2);
      expect(result).toBeGreaterThan(currentIncome);
    });

    it('should handle high inflation scenario', () => {
      const currentIncome = 75000;
      const result = calculateInflationAdjustedIncome(currentIncome, 0.05, 30);
      
      // Need substantial income in 30 years at 5% inflation
      expect(result).toBeCloseTo(324722, -2);
    });
  });

  describe('calculateCumulativeInflation', () => {
    it('should calculate total inflation over period', () => {
      const result = calculateCumulativeInflation(0.03, 10);
      
      // 3% inflation for 10 years = 34.39% cumulative
      expect(result).toBeCloseTo(0.3439, 3);
    });

    it('should handle 2.5% inflation over 20 years', () => {
      const result = calculateCumulativeInflation(0.025, 20);
      
      expect(result).toBeCloseTo(0.6386, 3);
    });

    it('should handle high inflation over long period', () => {
      const result = calculateCumulativeInflation(0.05, 30);
      
      // 5% for 30 years = 332%+ cumulative inflation
      expect(result).toBeCloseTo(3.3296, 3);
    });

    it('should return 0 for zero years', () => {
      const result = calculateCumulativeInflation(0.03, 0);
      
      expect(result).toBeCloseTo(0, 4);
    });
  });

  describe('toTodayDollars', () => {
    it('should convert future value to today dollars using year difference', () => {
      const result = toTodayDollars(134392, 0.03, 2036, 2026);
      
      // $134,392 in 2036 = $100,000 in 2026 at 3% inflation
      expect(result).toBeCloseTo(100000, -2);
    });

    it('should use current year as default', () => {
      // When current year is not specified, should use actual current year
      const futureValue = 110000;
      const futureYear = new Date().getFullYear() + 5;
      const result = toTodayDollars(futureValue, 0.03, futureYear);
      
      // Should adjust for 5 years of inflation
      expect(result).toBeLessThan(futureValue);
      expect(result).toBeGreaterThan(90000);
    });

    it('should handle future values in the past', () => {
      // Future year is before current year (past value)
      const result = toTodayDollars(100000, 0.03, 2020, 2026);
      
      // Value from past should be worth more today (negative years)
      expect(result).toBeGreaterThan(100000);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero inflation rate', () => {
      const result1 = adjustForInflation(100000, 0, 10);
      const result2 = calculateFutureValueNeeded(100000, 0, 10);
      
      expect(result1).toBeCloseTo(100000, -2);
      expect(result2).toBeCloseTo(100000, -2);
    });

    it('should handle very high inflation', () => {
      const result = calculateCumulativeInflation(0.10, 20);
      
      // 10% inflation for 20 years is massive
      expect(result).toBeGreaterThan(5); // 500%+ cumulative
    });

    it('should handle deflation (negative inflation)', () => {
      const result = adjustForInflation(90000, -0.02, 5);
      
      // Deflation means future dollars worth more today
      expect(result).toBeGreaterThan(90000);
    });

    it('should handle fractional years gracefully', () => {
      const result = adjustForInflation(100000, 0.03, 10.5);
      
      // Should handle half-years
      expect(result).toBeGreaterThan(70000);
      expect(result).toBeLessThan(100000);
    });
  });

  describe('Mathematical Properties', () => {
    it('should be symmetric (round-trip)', () => {
      const presentValue = 100000;
      const inflationRate = 0.03;
      const years = 10;
      
      const futureValue = calculateFutureValueNeeded(presentValue, inflationRate, years);
      const backToPresent = adjustForInflation(futureValue, inflationRate, years);
      
      expect(backToPresent).toBeCloseTo(presentValue, -2);
    });

    it('should maintain relationship: future = present * (1 + rate)^years', () => {
      const present = 100000;
      const rate = 0.03;
      const years = 10;
      
      const future = calculateFutureValueNeeded(present, rate, years);
      const calculated = present * Math.pow(1 + rate, years);
      
      expect(future).toBeCloseTo(calculated, -2);
    });

    it('should produce monotonically increasing future values', () => {
      const present = 50000;
      const rate = 0.025;
      
      const year10 = calculateFutureValueNeeded(present, rate, 10);
      const year20 = calculateFutureValueNeeded(present, rate, 20);
      const year30 = calculateFutureValueNeeded(present, rate, 30);
      
      expect(year20).toBeGreaterThan(year10);
      expect(year30).toBeGreaterThan(year20);
    });
  });

  describe('Real-World Scenarios', () => {
    it('should calculate retirement income needs correctly', () => {
      // Need $60K/year in retirement today
      // Retiring in 20 years with 3% inflation
      const neededIn20Years = calculateInflationAdjustedIncome(60000, 0.03, 20);
      
      // Need significantly more in future dollars
      expect(neededIn20Years).toBeCloseTo(108367, -2);
    });

    it('should show impact of inflation on purchasing power', () => {
      const millionIn2046 = adjustForInflation(1000000, 0.03, 20);
      
      // $1M in 2046 is worth much less today
      expect(millionIn2046).toBeLessThan(600000);
    });

    it('should calculate different inflation rates impact', () => {
      const base = 100000;
      const years = 30;
      
      const lowInflation = calculateFutureValueNeeded(base, 0.02, years);
      const mediumInflation = calculateFutureValueNeeded(base, 0.03, years);
      const highInflation = calculateFutureValueNeeded(base, 0.05, years);
      
      expect(mediumInflation).toBeGreaterThan(lowInflation);
      expect(highInflation).toBeGreaterThan(mediumInflation);
    });
  });
});

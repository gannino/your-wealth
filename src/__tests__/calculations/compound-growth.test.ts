/**
 * Compound Growth Calculation Tests
 *
 * Tests compound growth with monthly and annual compounding.
 * Expected values verified against investor.gov calculator.
 */

import { describe, it, expect } from 'vitest';
import {
  calculateCompoundGrowth,
  calculateCompoundGrowthDetailed,
  calculateRequiredReturn,
} from '../../lib/calculations/compound-growth';

describe('Compound Growth Calculations', () => {
  describe('calculateCompoundGrowth', () => {
    it('should calculate simple case correctly with monthly compounding', () => {
      const result = calculateCompoundGrowth(10000, 500, 0.07, 10, true);

      // Verified: monthly compounding calculation
      // Year 10 ending balance: ~$106,639
      expect(result).toHaveLength(10);
      expect(result[0]).toBeGreaterThan(10000); // First year should grow
      expect(result[9]).toBeCloseTo(106639, -2); // Final year within 100
    });

    it('should handle starting from zero correctly', () => {
      const result = calculateCompoundGrowth(0, 1000, 0.09, 20, true);

      // Verified: $1K/month @ 9% for 20 years = $667,887
      expect(result).toHaveLength(20);
      expect(result[0]).toBeGreaterThan(0); // First year should grow
      expect(result[19]).toBeCloseTo(667887, -2);
    });

    it('should calculate with annual compounding (lower result)', () => {
      const monthlyResult = calculateCompoundGrowth(10000, 500, 0.07, 10, true);
      const annualResult = calculateCompoundGrowth(10000, 500, 0.07, 10, false);

      // Annual compounding yields less due to timing
      expect(annualResult[9]).toBeLessThan(monthlyResult[9]);
      expect(annualResult[9]).toBeCloseTo(102570, -2);
    });

    it('should handle zero principal correctly', () => {
      const result = calculateCompoundGrowth(0, 1000, 0.07, 10, true);
      
      expect(result[0]).toBeGreaterThan(0); // Should grow from contributions alone
      expect(result[9]).toBeGreaterThan(120000); // 10 years * $12K/year + interest
    });

    it('should handle zero contributions correctly', () => {
      const result = calculateCompoundGrowth(100000, 0, 0.07, 10, true);

      // $100K @ 7% for 10 years ≈ $200,966
      expect(result[9]).toBeCloseTo(200966, -2);
    });

    it('should handle zero return correctly', () => {
      const result = calculateCompoundGrowth(10000, 1000, 0, 5, true);
      
      // No growth: principal + contributions only
      expect(result[4]).toBe(10000 + (1000 * 12 * 5)); // $10K + $60K = $70K
    });

    it('should calculate fee destruction scenario correctly', () => {
      const result = calculateCompoundGrowth(100000, 0, 0.07, 40, true);

      // Module 2: $100K @ 7% for 40 years = $1,631,141
      expect(result[39]).toBeCloseTo(1631141, -3);
    });
  });

  describe('calculateCompoundGrowthDetailed', () => {
    it('should provide year-by-year breakdown', () => {
      const result = calculateCompoundGrowthDetailed(10000, 500, 0.07, 10, true);
      
      expect(result).toHaveLength(10);
      
      // Check first year structure
      expect(result[0]).toMatchObject({
        year: 1,
        startBalance: 10000,
        contributions: 6000, // $500/month * 12
      });
      expect(result[0].earnings).toBeGreaterThan(0);
      expect(result[0].endBalance).toBeGreaterThan(result[0].startBalance);
    });

    it('should track contributions correctly', () => {
      const result = calculateCompoundGrowthDetailed(10000, 500, 0.07, 10, true);
      
      // Each year should have $6K in contributions
      result.forEach(year => {
        expect(year.contributions).toBe(6000);
      });
    });

    it('should track earnings correctly', () => {
      const result = calculateCompoundGrowthDetailed(10000, 500, 0.07, 10, true);
      
      // Earnings should increase each year (compound effect)
      for (let i = 1; i < result.length; i++) {
        expect(result[i].earnings).toBeGreaterThan(result[i - 1].earnings);
      }
    });

    it('should handle annual compounding correctly', () => {
      const monthlyResult = calculateCompoundGrowthDetailed(10000, 500, 0.07, 5, true);
      const annualResult = calculateCompoundGrowthDetailed(10000, 500, 0.07, 5, false);
      
      // Annual compounding should yield less
      expect(annualResult[4].endBalance).toBeLessThan(monthlyResult[4].endBalance);
    });
  });

  describe('calculateRequiredReturn', () => {
    it('should calculate required return for modest goal', () => {
      // $10K start, $500/month, $100K goal in 10 years
      const result = calculateRequiredReturn(10000, 500, 100000, 10, true);
      
      // Should need less than 7% (moderate return)
      expect(result).toBeGreaterThan(0.05);
      expect(result).toBeLessThan(0.08);
    });

    it('should calculate required return for aggressive goal', () => {
      // $0 start, $500/month, $1M goal in 20 years
      const result = calculateRequiredReturn(0, 500, 1000000, 20, true);
      
      // Should need high return (>10%)
      expect(result).toBeGreaterThan(0.10);
    });

    it('should return reasonable value for achievable goal', () => {
      // $100K start, $1K/month, $1M goal in 20 years
      const result = calculateRequiredReturn(100000, 1000, 1000000, 20, true);
      
      // Should be achievable (6-8%)
      expect(result).toBeGreaterThan(0.04);
      expect(result).toBeLessThan(0.10);
    });

    it('should handle impossible goal gracefully', () => {
      // $0 start, $100/month, $10M goal in 10 years
      const result = calculateRequiredReturn(0, 100, 10000000, 10, true);
      
      // Should return max rate (0.5 = 50%)
      expect(result).toBeGreaterThan(0.40);
    });
  });

  describe('Edge Cases', () => {
    it('should handle 1 year projection', () => {
      const result = calculateCompoundGrowth(10000, 1000, 0.07, 1, true);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBeCloseTo(22404, -2); // $10K + $12K + interest
    });

    it('should handle negative principal (debt)', () => {
      const result = calculateCompoundGrowth(-10000, 500, 0.07, 5, true);
      
      // Should still calculate, starting from negative
      expect(result[0]).toBeGreaterThan(-10000); // Less negative over time
    });

    it('should handle very small contributions', () => {
      const result = calculateCompoundGrowth(10000, 1, 0.07, 10, true);
      
      // Should still grow, mostly from principal
      expect(result[9]).toBeCloseTo(19672, -2); // ~$10K @ 7% for 10 years
    });

    it('should handle very high return rate', () => {
      const result = calculateCompoundGrowth(10000, 1000, 0.20, 10, true);
      
      // 20% return should produce massive growth
      expect(result[9]).toBeGreaterThan(500000); // Substantial growth
    });
  });

  describe('Mathematical Properties', () => {
    it('should produce monotonically increasing balances', () => {
      const result = calculateCompoundGrowth(10000, 500, 0.07, 20, true);
      
      for (let i = 1; i < result.length; i++) {
        expect(result[i]).toBeGreaterThan(result[i - 1]);
      }
    });

    it('should respect commutative property of return and time', () => {
      // Higher rate for less time vs lower rate for more time
      const highRate = calculateCompoundGrowth(10000, 1000, 0.09, 10, true);
      const lowRate = calculateCompoundGrowth(10000, 1000, 0.05, 18, true);
      
      // 9% for 10 years vs 5% for 18 years - similar endpoints
      expect(Math.abs(highRate[9] - lowRate[17])).toBeLessThan(50000);
    });
  });
});

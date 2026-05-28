/**
 * Tax Calculation Tests
 *
 * Tests after-tax income, capital gains, and effective tax rates.
 * Based on US tax brackets (simplified).
 */

import { describe, it, expect } from 'vitest';
import {
  calculateAfterTaxIncome,
  calculateAfterTaxAndSavings,
  calculateCapitalGainsTax,
  calculateAfterTaxGains,
  estimateEffectiveTaxRate,
  calculateMonthlyDisposable,
} from '../../lib/calculations/tax';

describe('After-Tax Income Calculations', () => {
  describe('calculateAfterTaxIncome', () => {
    it('should calculate after-tax income correctly', () => {
      const result = calculateAfterTaxIncome(65000, 0.22);
      
      expect(result).toBe(50700);
    });

    it('should handle high earner', () => {
      const result = calculateAfterTaxIncome(180000, 0.28);
      
      expect(result).toBe(129600);
    });

    it('should handle zero tax rate', () => {
      const result = calculateAfterTaxIncome(100000, 0);
      
      expect(result).toBe(100000);
    });

    it('should handle 100% tax rate (edge case)', () => {
      const result = calculateAfterTaxIncome(100000, 1.0);
      
      expect(result).toBe(0);
    });

    it('should round to whole dollars', () => {
      const result = calculateAfterTaxIncome(100001, 0.22);
      
      expect(result).toBe(78000); // 100001 * 0.78
    });
  });

  describe('calculateAfterTaxAndSavings', () => {
    it('should subtract savings from after-tax income', () => {
      const result = calculateAfterTaxAndSavings(120000, 0.25, 18000);
      
      expect(result).toBe(72000); // (120000 * 0.75) - 18000
    });

    it('should handle zero savings', () => {
      const result = calculateAfterTaxAndSavings(100000, 0.25, 0);
      
      expect(result).toBe(75000); // Same as after-tax income
    });

    it('should handle savings exceeding after-tax income', () => {
      const result = calculateAfterTaxAndSavings(100000, 0.25, 80000);
      
      expect(result).toBe(-5000); // Negative disposable income
    });
  });
});

describe('Capital Gains Calculations', () => {
  describe('calculateCapitalGainsTax', () => {
    it('should calculate tax on gains correctly', () => {
      const tax = calculateCapitalGainsTax(50000, 0.15);
      
      expect(tax).toBe(7500);
    });

    it('should handle zero gains', () => {
      const tax = calculateCapitalGainsTax(0, 0.15);
      
      expect(tax).toBe(0);
    });

    it('should handle zero tax rate', () => {
      const tax = calculateCapitalGainsTax(50000, 0);
      
      expect(tax).toBe(0);
    });

    it('should handle higher capital gains rate', () => {
      const tax = calculateCapitalGainsTax(100000, 0.20);
      
      expect(tax).toBe(20000);
    });
  });

  describe('calculateAfterTaxGains', () => {
    it('should subtract tax from gains', () => {
      const result = calculateAfterTaxGains(50000, 0.15);
      
      expect(result).toBe(42500); // 50000 - 7500
    });

    it('should handle zero gains', () => {
      const result = calculateAfterTaxGains(0, 0.15);
      
      expect(result).toBe(0);
    });
  });
});

describe('Effective Tax Rate', () => {
  describe('estimateEffectiveTaxRate', () => {
    it('should calculate rate for income in first bracket', () => {
      const rate = estimateEffectiveTaxRate(10000);
      
      // All in 10% bracket
      expect(rate).toBeCloseTo(0.10, 2);
    });

    it('should calculate rate for middle-income earner', () => {
      const rate = estimateEffectiveTaxRate(100000);
      
      // Blended rate across brackets
      expect(rate).toBeCloseTo(0.1708, 3);
    });

    it('should calculate rate for high earner', () => {
      const rate = estimateEffectiveTaxRate(500000);
      
      // Should be in top bracket but not 37% effective
      expect(rate).toBeGreaterThan(0.30);
      expect(rate).toBeLessThan(0.37);
    });

    it('should handle very high income', () => {
      const rate = estimateEffectiveTaxRate(1000000);
      
      // Approaches but doesn't reach 37%
      expect(rate).toBeGreaterThan(0.35);
      expect(rate).toBeLessThan(0.37);
    });

    it('should increase monotonically with income', () => {
      const rate50K = estimateEffectiveTaxRate(50000);
      const rate100K = estimateEffectiveTaxRate(100000);
      const rate200K = estimateEffectiveTaxRate(200000);
      
      expect(rate100K).toBeGreaterThan(rate50K);
      expect(rate200K).toBeGreaterThan(rate100K);
    });
  });
});

describe('Monthly Disposable Income', () => {
  describe('calculateMonthlyDisposable', () => {
    it('should calculate disposable income correctly', () => {
      const result = calculateMonthlyDisposable(10000, 0.25, 2000);
      
      // Annual: 120000 * 0.75 = 90000
      // Monthly: 90000 / 12 = 7500
      // After savings: 7500 - 2000 = 5500
      expect(result).toBeCloseTo(5500, -2);
    });

    it('should handle zero savings', () => {
      const result = calculateMonthlyDisposable(10000, 0.25, 0);
      
      expect(result).toBeCloseTo(7500, -2);
    });

    it('should handle zero tax rate', () => {
      const result = calculateMonthlyDisposable(10000, 0, 2000);
      
      expect(result).toBe(8000); // 10000 - 2000
    });
  });
});

describe('Real-World Scenarios', () => {
  it('should calculate young professional finances', () => {
    // $65K gross, 22% effective rate, $500/month savings
    const afterTax = calculateAfterTaxIncome(65000, 0.22);
    const disposable = calculateMonthlyDisposable(65000 / 12, 0.22, 500);
    
    expect(afterTax).toBe(50700);
    expect(disposable).toBeCloseTo(3725, -2); // (50700 / 12) - 500
  });

  it('should calculate mid-career finances', () => {
    // $120K gross, 25% effective rate, $1.5K/month savings
    const afterTax = calculateAfterTaxIncome(120000, 0.25);
    const disposable = calculateMonthlyDisposable(120000 / 12, 0.25, 1500);
    
    expect(afterTax).toBe(90000);
    expect(disposable).toBe(6000); // (90000 / 12) - 1500
  });

  it('should calculate high earner finances', () => {
    // $180K gross, 28% effective rate, $2.5K/month savings
    const afterTax = calculateAfterTaxIncome(180000, 0.28);
    const disposable = calculateMonthlyDisposable(180000 / 12, 0.28, 2500);
    
    expect(afterTax).toBe(129600);
    expect(disposable).toBe(8300); // (129600 / 12) - 2500
  });

  it('should show impact of capital gains tax', () => {
    const gains = 100000;
    const longTermRate = 0.15;
    const shortTermRate = 0.32;
    
    const longTermTax = calculateCapitalGainsTax(gains, longTermRate);
    const shortTermTax = calculateCapitalGainsTax(gains, shortTermRate);
    
    expect(longTermTax).toBe(15000);
    expect(shortTermTax).toBe(32000);
    
    // Long-term is much better
    expect(shortTermTax - longTermTax).toBe(17000);
  });
});

describe('Edge Cases', () => {
  it('should handle zero income', () => {
    const afterTax = calculateAfterTaxIncome(0, 0.22);
    const effectiveRate = estimateEffectiveTaxRate(0);
    
    expect(afterTax).toBe(0);
    expect(effectiveRate).toBe(0);
  });

  it('should handle very small income', () => {
    const effectiveRate = estimateEffectiveTaxRate(1000);
    
    // Should be in lowest bracket
    expect(effectiveRate).toBeCloseTo(0.10, 2);
  });

  it('should handle tax rate boundaries', () => {
    // Just below bracket boundary
    const rate1 = estimateEffectiveTaxRate(44000);
    // Just above bracket boundary
    const rate2 = estimateEffectiveTaxRate(45000);
    
    expect(rate2).toBeGreaterThan(rate1);
  });
});

describe('Mathematical Properties', () => {
  it('should maintain relationship: afterTax = gross * (1 - rate)', () => {
    const gross = 100000;
    const rate = 0.25;
    
    const afterTax = calculateAfterTaxIncome(gross, rate);
    const expected = gross * (1 - rate);
    
    expect(afterTax).toBe(expected);
  });

  it('should be consistent across monthly and annual calculations', () => {
    const annualGross = 120000;
    const rate = 0.25;
    const monthlySavings = 1500;
    
    const annualAfterTax = calculateAfterTaxIncome(annualGross, rate);
    const monthlyDisposable = calculateMonthlyDisposable(
      annualGross / 12,
      rate,
      monthlySavings
    );
    
    // Monthly disposable should equal (annual after-tax / 12) - savings
    const expected = (annualAfterTax / 12) - monthlySavings;
    expect(monthlyDisposable).toBeCloseTo(expected, -2);
  });

  it('should produce monotonically decreasing after-tax income with rate', () => {
    const gross = 100000;
    
    const rate10 = calculateAfterTaxIncome(gross, 0.10);
    const rate25 = calculateAfterTaxIncome(gross, 0.25);
    const rate40 = calculateAfterTaxIncome(gross, 0.40);
    
    expect(rate25).toBeLessThan(rate10);
    expect(rate40).toBeLessThan(rate25);
  });
});

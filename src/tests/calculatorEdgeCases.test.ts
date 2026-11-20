import { describe, it, expect } from 'vitest';
import {
  calculateTotalEMI,
  calculateRemainingIncome,
  calculateEmiSummary,
  simulateAdditionalEmi,
  validateCommitment,
  validateIncome,
} from '../lib/emiCalculations';
import { parseCleanNumber } from '../lib/utils';

describe('Calculator Advanced Edge Cases & Boundary Conditions', () => {
  it('handles floating point currency amounts accurately', () => {
    const commitments = [
      { monthlyAmount: 2500.45 },
      { monthlyAmount: 3499.55 },
    ];
    const total = calculateTotalEMI(commitments);
    expect(total).toBeCloseTo(6000.0, 2);

    const summary = calculateEmiSummary(50000, commitments);
    expect(summary.totalMonthlyEmi).toBeCloseTo(6000.0, 2);
    expect(summary.remainingIncome).toBeCloseTo(44000.0, 2);
    expect(summary.incomeCommittedPercentage).toBeCloseTo(12.0, 2);
  });

  it('handles large corporate or mortgage figures without overflow', () => {
    const commitments = [
      { monthlyAmount: 150000 },
      { monthlyAmount: 75000 },
    ];
    const summary = calculateEmiSummary(500000, commitments);
    expect(summary.totalMonthlyEmi).toBe(225000);
    expect(summary.remainingIncome).toBe(275000);
    expect(summary.incomeCommittedPercentage).toBe(45);
  });

  it('handles zero commitments with zero income safely', () => {
    const summary = calculateEmiSummary(0, []);
    expect(summary.totalMonthlyEmi).toBe(0);
    expect(summary.remainingIncome).toBe(0);
    expect(summary.incomeCommittedPercentage).toBeNull();
  });

  it('correctly calculates difference when proposed what-if EMI is 0 (simulation reset)', () => {
    const existing = [{ monthlyAmount: 5000 }];
    const simulation = simulateAdditionalEmi(25000, existing, {
      name: 'Zero Simulation',
      monthlyAmount: 0,
    });

    expect(simulation.current.totalMonthlyEmi).toBe(5000);
    expect(simulation.simulated.totalMonthlyEmi).toBe(5000);
    expect(simulation.difference.monthlyEmiChange).toBe(0);
    expect(simulation.difference.percentagePointsChange).toBeCloseTo(0, 2);
    expect(simulation.difference.remainingIncomeChange).toBe(0);
  });

  it('handles simulation when existing income is 0', () => {
    const existing = [{ monthlyAmount: 3000 }];
    const simulation = simulateAdditionalEmi(0, existing, {
      name: 'Proposed Loan',
      monthlyAmount: 2000,
    });

    expect(simulation.current.incomeCommittedPercentage).toBeNull();
    expect(simulation.simulated.incomeCommittedPercentage).toBeNull();
    expect(simulation.difference.monthlyEmiChange).toBe(2000);
    expect(simulation.difference.remainingIncomeChange).toBe(-2000);
  });

  it('ensures remaining income formula equals income minus total EMI', () => {
    const income = 75000;
    const commitments = [
      { monthlyAmount: 12500 },
      { monthlyAmount: 6200 },
      { monthlyAmount: 4300 },
    ];
    const total = calculateTotalEMI(commitments);
    expect(calculateRemainingIncome(income, total)).toBe(income - total);
  });

  it('validates string whitespace in commitment name', () => {
    expect(validateCommitment({ name: '   ', monthlyAmount: 5000 }).isValid).toBe(false);
    expect(validateCommitment({ name: 'Valid Loan', monthlyAmount: 5000 }).isValid).toBe(true);
  });

  describe('Negative Input Sanitization & Validation (Batch 2 Regression)', () => {
    it('preserves negative values in parseCleanNumber so validation can catch them', () => {
      expect(parseCleanNumber('-50000')).toBe(-50000);
      expect(parseCleanNumber('-2500.50')).toBe(-2500.5);
      expect(parseCleanNumber('-')).toBe(0);
      expect(parseCleanNumber('₹35,000')).toBe(35000);
    });

    it('rejects negative income in validateIncome with proper error message', () => {
      const negativeResult = validateIncome(parseCleanNumber('-50000'));
      expect(negativeResult.isValid).toBe(false);
      expect(negativeResult.error).toBe('Income cannot be negative');

      const positiveResult = validateIncome(parseCleanNumber('50000'));
      expect(positiveResult.isValid).toBe(true);
      expect(positiveResult.error).toBeUndefined();
    });

    it('rejects negative or zero monthly amounts in validateCommitment', () => {
      const negativeEmi = validateCommitment({
        name: 'Auto Loan',
        monthlyAmount: parseCleanNumber('-5500'),
      });
      expect(negativeEmi.isValid).toBe(false);
      expect(negativeEmi.errors.amount).toBe('Monthly EMI must be greater than ₹0');

      const zeroEmi = validateCommitment({
        name: 'Auto Loan',
        monthlyAmount: 0,
      });
      expect(zeroEmi.isValid).toBe(false);
      expect(zeroEmi.errors.amount).toBe('Monthly EMI must be greater than ₹0');
    });
  });
});

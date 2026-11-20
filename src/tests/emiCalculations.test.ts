import { describe, it, expect } from 'vitest';
import {
  calculateTotalEMI,
  calculateEMIRatio,
  calculateEmiSummary,
  simulateAdditionalEmi,
  validateIncome,
  validateCommitment,
} from '../lib/emiCalculations';

describe('Financial Arithmetic — EMI Calculations', () => {
  it('handles empty commitments array correctly', () => {
    expect(calculateTotalEMI([])).toBe(0);
    const summary = calculateEmiSummary(50000, []);
    expect(summary.totalMonthlyEmi).toBe(0);
    expect(summary.incomeCommittedPercentage).toBe(0);
    expect(summary.remainingIncome).toBe(50000);
  });

  it('correctly sums a single EMI commitment', () => {
    const commitments = [{ monthlyAmount: 6500 }];
    expect(calculateTotalEMI(commitments)).toBe(6500);
    const summary = calculateEmiSummary(40000, commitments);
    expect(summary.totalMonthlyEmi).toBe(6500);
    expect(summary.incomeCommittedPercentage).toBeCloseTo(16.25, 2);
    expect(summary.remainingIncome).toBe(33500);
  });

  it('correctly sums multiple EMI commitments (DESIGN.md Section 5.3 example)', () => {
    // Example from DESIGN.md: Smartphone (2500) + Bike (5500) + Laptop (2000) = 10,000 on 35,000 income
    const commitments = [
      { monthlyAmount: 2500 },
      { monthlyAmount: 5500 },
      { monthlyAmount: 2000 },
    ];
    expect(calculateTotalEMI(commitments)).toBe(10000);

    const summary = calculateEmiSummary(35000, commitments);
    expect(summary.totalMonthlyEmi).toBe(10000);
    expect(summary.incomeCommittedPercentage).toBeCloseTo(28.5714, 2);
    expect(summary.remainingIncome).toBe(25000);
  });

  it('prevents division by zero when income is 0', () => {
    expect(calculateEMIRatio(10000, 0)).toBeNull();
    const summary = calculateEmiSummary(0, [{ monthlyAmount: 5000 }]);
    expect(summary.incomeCommittedPercentage).toBeNull();
    expect(summary.remainingIncome).toBe(-5000);
  });

  it('handles negative income safely', () => {
    expect(calculateEMIRatio(5000, -20000)).toBeNull();
    const summary = calculateEmiSummary(-10000, [{ monthlyAmount: 2000 }]);
    expect(summary.monthlyIncome).toBe(0);
    expect(summary.incomeCommittedPercentage).toBeNull();
    expect(summary.remainingIncome).toBe(-2000);
  });

  it('correctly handles commitments exceeding monthly income', () => {
    const commitments = [{ monthlyAmount: 40000 }];
    const summary = calculateEmiSummary(30000, commitments);
    expect(summary.totalMonthlyEmi).toBe(40000);
    expect(summary.incomeCommittedPercentage).toBeCloseTo(133.33, 2);
    expect(summary.remainingIncome).toBe(-10000);
  });

  it('simulates proposed additional EMI without mutating original commitments (DESIGN.md Section 5.5 example)', () => {
    // DESIGN.md example:
    // Current: 10,000 EMI on 35,000 income -> 28.57% ratio, 25,000 remaining
    // Proposed: 3,000 EMI -> New: 13,000 EMI, 37.14% ratio, 22,000 remaining
    const original = [
      { monthlyAmount: 2500 },
      { monthlyAmount: 5500 },
      { monthlyAmount: 2000 },
    ];
    const originalLength = original.length;

    const result = simulateAdditionalEmi(35000, original, {
      name: 'Proposed Personal Loan',
      monthlyAmount: 3000,
    });

    // Ensure non-mutation of input array
    expect(original.length).toBe(originalLength);

    // Current before
    expect(result.current.totalMonthlyEmi).toBe(10000);
    expect(result.current.incomeCommittedPercentage).toBeCloseTo(28.57, 1);
    expect(result.current.remainingIncome).toBe(25000);

    // Simulated after
    expect(result.simulated.totalMonthlyEmi).toBe(13000);
    expect(result.simulated.incomeCommittedPercentage).toBeCloseTo(37.14, 1);
    expect(result.simulated.remainingIncome).toBe(22000);

    // Differences
    expect(result.difference.monthlyEmiChange).toBe(3000);
    expect(result.difference.percentagePointsChange).toBeCloseTo(8.57, 1);
    expect(result.difference.remainingIncomeChange).toBe(-3000);
  });

  it('validates income input correctly', () => {
    expect(validateIncome(50000).isValid).toBe(true);
    expect(validateIncome(-500).isValid).toBe(false);
    expect(validateIncome(NaN).isValid).toBe(false);
  });

  it('validates commitment fields correctly', () => {
    expect(validateCommitment({ name: 'Car Loan', monthlyAmount: 12000 }).isValid).toBe(true);
    expect(validateCommitment({ name: '', monthlyAmount: 12000 }).isValid).toBe(false);
    expect(validateCommitment({ name: 'Phone', monthlyAmount: 0 }).isValid).toBe(false);
    expect(validateCommitment({ name: 'Phone', monthlyAmount: -500 }).isValid).toBe(false);
    expect(validateCommitment({ name: 'Bike', monthlyAmount: 3000, tenureMonths: -1 }).isValid).toBe(false);
  });
});
